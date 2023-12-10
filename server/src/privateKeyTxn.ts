import { Account, Aptos, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import CryptoJS from 'crypto-js';

type Request = {
  pk: string;
  recipient: string;
  amount: number;
};

function decryptPhrase(encryptedPhrase: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedPhrase, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function padHexString(input: string): string {
  let hexString = input.startsWith('0x') ? input.slice(2) : input;
  const length = 64;
  while (hexString.length < length) {
    hexString = '0' + hexString;
  }
  return '0x' + hexString;
}

export async function privateKeyTxn(request: Request) {
  const aptos = new Aptos();

  const requestBody: Request = request;
  const { recipient, pk, amount } = requestBody;
  const key = 'key';
  console.log({ pk, recipient, amount });
  const decryptedKey: string = decryptPhrase(pk, key);
  console.log('Decrypted Text:', decryptedKey);

  const privateKey = new Ed25519PrivateKey(decryptedKey);
  const account = Account.fromPrivateKey({ privateKey });

  const txn = await aptos.transferCoinTransaction({
    sender: account,
    recipient: padHexString(recipient),
    amount,
  });
  const txn1 = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction: txn,
  });
  console.log(txn1);
  return txn1;
}
