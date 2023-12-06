import { Account, AccountAddress, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

import { getAptosEntropy } from './GenKeyPair';

const HOST = 'http://localhost:5500';

/**
 * Create an account on the APTOS protocol.
 *
 * @returns { transactionHash, accountAddress } The transaction hash and account accountAddress.
 * @throws {Error} If the account could not be created.
 */
export default async function createAccount(): Promise<{
  transactionHash: any;
  accountAddress: string;
}> {
  const keypair = await getAptosEntropy();
  if (!keypair.privateKey) {
    throw new Error('No private key found');
  }
  const privateKey = new Ed25519PrivateKey(keypair.privateKey);
  const account = Account.fromPrivateKey({ privateKey });
  console.log(
    'Created new account with private key: ',
    keypair.privateKey,
    '\nAccout is: ',
    account,
  );
  const txn = await fetch(`${HOST}/createAccount`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: account.accountAddress.toString(),
      amt: 20000000
    }),
  })
  .then(res => res.json())
  return {
    transactionHash: txn,
    accountAddress: account.accountAddress.toString(),
  };
}
