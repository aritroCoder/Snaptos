import cors from 'cors';
import express, { Request, Response } from 'express';
import checkBalance from './src/CheckBalance';
import { createAccount } from './src/CreateAccount';
import { doTransaction } from './src/Transaction';

const app = express();

app.use(express.json());
app.use(cors<Request>());

app.post('/createAccount', async (req: Request, res: Response) => {
  res.json(await createAccount(req.body));
});

app.post('/doTransaction', async (req: Request, res: Response) => {
  res.json(await doTransaction(req.body));
});

app.post('/getBalance', async (req: Request, res: Response) => {
  res.json(await checkBalance(req.body));
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
