/* eslint-disable */
import { AccountAddress, Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';

type Request = {
    hash: string;
    network: string;
};

export async function getTransByHash(request: Request) {
    const requestBody: Request = request;
    const networkType = requestBody.network;
  
    let APTOS_NETWORK: Network;
  
    if (networkType === 'DEVNET') {
      APTOS_NETWORK = Network.DEVNET;
    } else if (networkType === 'TESTNET') {
      APTOS_NETWORK = Network.TESTNET;
    } else if (networkType === 'MAINNET') {
      APTOS_NETWORK = Network.MAINNET;
    }
    
    const aptosConfig = new AptosConfig({ network: APTOS_NETWORK });
    const aptos = new Aptos(aptosConfig);

    const txn = await aptos.getTransactionByHash({transactionHash: requestBody.hash});
    console.log('this is txn', txn);

    return txn; 
}