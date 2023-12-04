import cors from 'cors';
import express, { Request, Response } from 'express';
import checkBalance from './src/CheckBalance';
import { createAccount } from './src/CreateAccount';
import { genTxn } from './src/GenTxn';
import { doTransaction } from './src/Transaction';

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cors<Request>());

app.post('/createAccount', (req: Request, res: Response) => {
  createAccount(req.body).then((tx) => {
    console.log('this is tx one more time', tx);
    res.json({ tx });
  });
});

app.post('/doTransaction', (req: Request, res: Response) => {
  doTransaction(req.body).then((tx) => {
    console.log('this is tx one more time', tx);
    res.json({ tx });
  });
});

// app.post('/gettx', (req: Request, res: Response) => {
//   genTxn(req.body).then((tx) => {
//     res.json({ tx });
//   });
// });

app.post('/getBalance', async (req: Request, res: Response) => {
  res.json(await checkBalance(req.body));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
