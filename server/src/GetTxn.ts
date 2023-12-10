/* eslint-disable */
import { Aptos, AptosConfig, Network, TransactionResponse } from "@aptos-labs/ts-sdk";

type Request = {
    address: string;
    network: string;
}

export async function getTxn(request:Request) {

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
    const txnHistory : TransactionResponse[] = await aptos.getAccountTransactions({accountAddress: request.address});
    console.log('this is txnHis', txnHistory);

    return txnHistory;
    
}