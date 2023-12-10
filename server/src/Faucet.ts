/* eslint-disable  */
import { AptosConfig, Aptos, Network } from '@aptos-labs/ts-sdk';

type Request = {
    address: string;
    network: string;
  };

export async function fundMe(request: Request) {
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

    console.log('this is request body', requestBody);
    console.log(typeof requestBody.address);

    const txn = await aptos.fundAccount({
        accountAddress: requestBody.address,
        amount: 100000000,
        options: {
        indexerVersionCheck: false,
        },
    });
    console.log('this is txn', txn, typeof txn);

    return txn;
}
