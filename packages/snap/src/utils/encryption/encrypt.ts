import CryptoJs from 'crypto-js';

export default function encryptPhrase(phrase: string, key: string): string {
  const cipher = CryptoJs.AES.encrypt(phrase, key);
  return cipher.toString();
}
