import cors from 'cors';
import express, { Request, Response } from 'express';
import checkBalance from './src/CheckBalance';
import { createAccount } from './src/CreateAccount';
import { doTransaction } from './src/Transaction';
import { privateKeyTxn } from './src/privateKeyTxn';
<<<<<<< HEAD
import { getTxn } from './src/GetTxn';
import { genTxn } from './src/GenTxn';
=======
import { fundMe } from './src/Faucet';
>>>>>>> 121203cfc7d0f4363eeb5e76f664dea69d927164

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

app.post('/transaction', async (req: Request, res: Response) => {
  privateKeyTxn(req.body).then((tx) => {
    res.json({ tx });
  });
});

app.post('/getTxn', async (req: Request, res: Response) => {
  res.json(await getTxn(req.body));
});

app.post('/genTxn', async (req: Request, res: Response) => {
  res.json(await genTxn(req.body));
app.post('/fundMe', async (req: Request, res: Response) => {
  fundMe(req.body).then((tx) => {
    res.json({ tx });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
