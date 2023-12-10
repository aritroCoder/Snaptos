/* eslint-disable */
import { Aptos, AptosConfig, Network, NetworkToNetworkName } from '@aptos-labs/ts-sdk';

type Request = {
  address: string;
  amt: number;
  network: string;
};

/**
 * Create an account on the APTOS protocol.
 * @param request The request body.
 * @returns The transaction hash and account accountAddress.
 * @throws {Error} If the account could not be created.
 */
export async function createAccount(request: Request) {

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
    amount: requestBody.amt,
    options: {
      indexerVersionCheck: false,
    },
  });
  console.log('this is txn', txn, typeof txn);

  return txn;
}
