/* eslint-disable */
import { GetAccountCoinsDataResponse, Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";

interface Request {
    address: string;
    network: string;
}

export default async function checkBalance(request:Request) {

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
    const accountCoinsData: GetAccountCoinsDataResponse = await aptos.getAccountCoinsData({accountAddress: request.address});
    console.log('this is accountCoinsData', accountCoinsData);
    console.log({requestBody})
    console.log('network: ', networkType)

    return accountCoinsData;
    
}