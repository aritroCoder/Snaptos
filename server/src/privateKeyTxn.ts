/* eslint-disable */
import { Account, Aptos, AptosConfig, Ed25519PrivateKey, Network } from '@aptos-labs/ts-sdk';
import CryptoJS from 'crypto-js';

type Request = {
  pk: string;
  recipient: string;
  amount: number;
  network: string;
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
