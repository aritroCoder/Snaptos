# Python APT to USD rate forecasting engine
This is a simple python script that uses the BiLSTM model architecture to forecast the APT to USD rate for the next few minutes,given the data of last 16 minutes.

## Start the server
```bash
cd bin/
./deploy.sh up
```
This command might take more than 10 minutes on first run as it will download the docker images and build the containers.
Server will run on localhost:9000
View the documentation at localhost:9000/docs

## Stop the server
```bash
cd bin/
./deploy.sh down
```

