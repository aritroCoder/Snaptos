 /* eslint-disable */
import cors from 'cors';
import express, { Request, Response } from 'express';
import checkBalance from './src/CheckBalance';
import { createAccount } from './src/CreateAccount';
import { doTransaction } from './src/Transaction';
import { privateKeyTxn } from './src/privateKeyTxn';
import { getTxn } from './src/GetTxn';
import { genTxn } from './src/GenTxn';
import { fundMe } from './src/Faucet';
import { getTransByHash } from './src/GetTransByHash';
import { getGasPriceEstimation } from './src/gasPrice';
import { convertAptToUsd } from './src/aptToUsd';

import { AptosConfig, Network} from '@aptos-labs/ts-sdk';

const APTOS_NETWORK = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });

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
});

app.post('/fundMe', async (req: Request, res: Response) => {
  fundMe(req.body).then((tx) => {
    res.json({ tx });
  });
});
app.get('/gasPriceEstimate', async (req: Request, res: Response) => {
  res.json(await getGasPriceEstimation({aptosConfig: config}));
});

app.post('/getTransByHash', async (req: Request, res: Response) => {
  res.json(await getTransByHash(req.body));
});

app.get('/aptToUsd', async (req:Request,res: Response) => {
  res.json({APT : await convertAptToUsd()});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

