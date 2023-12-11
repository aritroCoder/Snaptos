from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
from copy import deepcopy as dc
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import Dataset
from torch.utils.data import DataLoader

device = "cuda:0" if torch.cuda.is_available() else "cpu"


class PriceData(BaseModel):  # price data of last 16 time stamps
    price_0: float
    price_1: float
    price_2: float
    price_3: float
    price_4: float
    price_5: float
    price_6: float
    price_7: float
    price_8: float
    price_9: float
    price_10: float
    price_11: float
    price_12: float
    price_13: float
    price_14: float
    price_15: float


class TimeSeriesDataset(Dataset):
    def __init__(self, X, y):
        self.X = X
        self.y = y

    def __len__(self):
        return len(self.X)

    def __getitem__(self, i):
        return self.X[i], self.y[i]


class LSTM(nn.Module):
    def __init__(self, input_size, hidden_size, hidden_size_2, num_stacked_layers):
        super().__init__()
        self.hidden_size = hidden_size
        self.hidden_size_2 = hidden_size_2
        self.num_stacked_layers = num_stacked_layers
        self.lstm = nn.LSTM(
            input_size, hidden_size, num_stacked_layers, batch_first=True
        )
        self.relu = nn.ReLU()
        self.fc = nn.Linear(hidden_size_2, 1)
        self.fc2 = nn.Linear(hidden_size, hidden_size_2)

    def forward(self, x):
        batch_size = x.size(0)
        h0 = torch.zeros(self.num_stacked_layers, batch_size, self.hidden_size).to(
            device
        )
        c0 = torch.zeros(self.num_stacked_layers, batch_size, self.hidden_size).to(
            device
        )
        out, _ = self.lstm(x, (h0, c0))
        out = self.relu(out[:, -1, :])
        out = self.fc2(out)
        out = self.relu(out)
        out = self.fc(out)
        return out


# Create a bidirectional LSTM model class
class BiLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, hidden_size_2, num_layers):
        super(BiLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.hidden_size_2 = hidden_size_2
        self.num_layers = num_layers
        self.lstm = nn.LSTM(
            input_size, hidden_size, num_layers, batch_first=True, bidirectional=True
        )
        self.fc = nn.Linear(hidden_size * 2, 1)

    def forward(self, x):
        # h0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(device)
        # c0 = torch.zeros(self.num_layers * 2, x.size(0), self.hidden_size).to(device)

        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])

        return out


def prepare_df_for_lstm(df, n_steps):
    df = dc(df)

    df.set_index("Minutes", inplace=True)

    for i in range(1, n_steps + 1):
        df[f"Price(t-{i})"] = df["Price"].shift(i)
    df.dropna(inplace=True)
    return df


def train_one_epoch(model, epoch, train_loader, loss_function, optimizer):
    model.train(True)
    print(f"Epoch: {epoch + 1}")
    running_loss = 0.0

    for batch_index, batch in enumerate(train_loader):
        x_batch, y_batch = batch[0].to(device), batch[1].to(device)
        output = model(x_batch)
        loss = loss_function(output, y_batch)
        running_loss += loss
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch_index % 100 == 99:
            avg_loss_batches = running_loss / 100
            print("Batch: {0}, loss: {1:.3f}".format(batch_index + 1, avg_loss_batches))
            running_loss = 0.0


def validate_one_epoch(model, test_loader, loss_function):
    model.train(False)
    running_loss = 0.0
    for batch_index, batch in enumerate(test_loader):
        x_batch, y_batch = batch[0].to(device), batch[1].to(device)
        with torch.no_grad():
            output = model(x_batch)
            loss = loss_function(output, y_batch)
            running_loss += loss

    avg_loss_batches = running_loss / len(test_loader)

    print("Val loss: {0:.3f}".format(avg_loss_batches))
    print("*********************************************")


app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


def train():
    data = pd.read_csv("apt.csv")
    data = data[["Minutes", "Price"]]
    lookback = 16
    shifted_df = prepare_df_for_lstm(data, lookback)
    shifted_df_as_np = shifted_df.to_numpy()
    scaler = MinMaxScaler(feature_range=(-1, 1))
    shifted_df_as_np = scaler.fit_transform(shifted_df_as_np)
    X = shifted_df_as_np[:, 1:]  # all the rows(first index), but first col onwards
    y = shifted_df_as_np[:, 0]
    X = dc(np.flip(X, axis=1))
    split_index = int(len(X) * 0.95)
    X_train = X[:split_index]
    X_test = X[split_index:]
    y_train = y[:split_index]
    y_test = y[split_index:]
    # it is required for pytorch LSTMs to have an extra dimention at the end
    X_train = X_train.reshape((-1, lookback, 1))
    X_test = X_test.reshape((-1, lookback, 1))
    y_train = y_train.reshape((-1, 1))
    y_test = y_test.reshape((-1, 1))
    X_train = torch.tensor(X_train).float()
    X_test = torch.tensor(X_test).float()
    y_train = torch.tensor(y_train).float()
    y_test = torch.tensor(y_test).float()
    train_dataset = TimeSeriesDataset(X_train, y_train)
    test_dataset = TimeSeriesDataset(X_test, y_test)
    batch_size = 9
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    for _, batch in enumerate(train_loader):
        x_batch, y_batch = batch[0].to(device), batch[1].to(device)
        print(x_batch.shape, y_batch.shape)
        break
    model = BiLSTM(1, 8, 4, 1)
    model.to(device)
    learning_rate = 0.001
    num_epochs = 100
    loss_function = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    for epoch in range(num_epochs):
        train_one_epoch(model, epoch, train_loader, loss_function, optimizer)
        validate_one_epoch(model, test_loader, loss_function)
    return model


model = train()


@app.post("/predict/")
async def predict_price(price_data: PriceData):
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()
    price_data = np.array(
        [
            price_data.price_0,
            price_data.price_1,
            price_data.price_2,
            price_data.price_3,
            price_data.price_4,
            price_data.price_5,
            price_data.price_6,
            price_data.price_7,
            price_data.price_8,
            price_data.price_9,
            price_data.price_10,
            price_data.price_11,
            price_data.price_12,
            price_data.price_13,
            price_data.price_14,
            price_data.price_15,
        ]
    )
    price_data = torch.tensor(price_data).float()
    # normalize the data
    scaler = MinMaxScaler(feature_range=(-1, 1))
    price_data = price_data.reshape((-1, 1))
    price_data_norm = scaler.fit_transform(price_data)
    price_data = price_data_norm.reshape((-1, 16, 1))
    print(price_data.shape)
    price_data = torch.tensor(price_data).float().to(device)
    with torch.no_grad():
        output = model(price_data)
        output = scaler.inverse_transform(output.cpu().numpy())
    prediction = {
        "price": output.item(),
    }
    return prediction
