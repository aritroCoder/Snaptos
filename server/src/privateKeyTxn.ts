import { Account,Aptos,Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import * as aes256 from 'aes256';

  type Request = {
    pk: string;
    recipient: string;
    amount: number;
  }

//   function encryptPhrase(phrase: string, key: string): string {
//     const cipher = aes256.createCipher(key);
  
//     if (typeof phrase === 'string') {
//       return cipher.encrypt(phrase);
//     } else {
//       throw new Error('Invalid');
//     }
//   }

  function decryptPhrase(encryptedPhrase: string, key: string): string {
    const cipher = aes256.createCipher(key);
  
    if (typeof encryptedPhrase === 'string') {
      return cipher.decrypt(encryptedPhrase);
    } else {
      throw new Error('Invalid');
    }
  }
  



export async function privateKeyTxn(request:Request) {

    const aptos = new Aptos();

    const requestBody: Request = request;
    const { recipient, pk, amount } = requestBody;
    const key = 'key';
    const decryptedKey: string = decryptPhrase(pk, key);
    console.log('Encrypted Text:', decryptedKey);

    const privateKey = new Ed25519PrivateKey(decryptedKey);
    const account = Account.fromPrivateKey({ privateKey: privateKey });

    const txn = await aptos.transferCoinTransaction({
      sender: account,
      recipient: recipient,
      amount: amount,
    });
    const txn1 = await aptos.signAndSubmitTransaction({ signer: account, transaction: txn });
    console.log(txn1);
    return txn1;

}

