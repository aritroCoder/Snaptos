import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

import { getAptosEntropy } from './GenKeyPair';

/**
 * Get an Aptos account from the private key stored in the browser's local storage.
 * @returns {Promise<Account>} An Aptos account.
 * @throws {Error} If no private key is found.
 */
export default async function getAccount() {
  const keypair = await getAptosEntropy();
  if (!keypair.privateKey) {
    throw new Error('No private key found');
  }
  const privateKey = new Ed25519PrivateKey(keypair.privateKey);
  const account = Account.fromPrivateKey({ privateKey });
  return account;
}
