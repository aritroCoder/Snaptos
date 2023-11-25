import { Account, Aptos, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

import { getAptosEntropy } from './GenKeyPair';

/**
 * Create an account on the APTOS protocol.
 *
 * @returns { transactionHash, accountAddress } The transaction hash and account accountAddress.
 * @throws {Error} If the account could not be created.
 */
export default async function createAccount(): {
  transactionHash: string;
  accountAddress: string;
} {
  const aptos = new Aptos();
  const keypair = await getAptosEntropy();
  if (!keypair.privateKey) {
    throw new Error('No private key found');
  }
  const privateKey = new Ed25519PrivateKey(keypair.privateKey);
  const account = Account.fromPrivateKey({ privateKey });
  console.log(
    'Created account with private key: ',
    keypair.privateKey,
    '\nAccout is: ',
    account,
  );
  const txn = await aptos.fundAccount({
    accountAddress: account.accountAddress,
    amount: 1,
  });
  return { transactionHash: txn, accountAddress: account.accountAddress };
}
