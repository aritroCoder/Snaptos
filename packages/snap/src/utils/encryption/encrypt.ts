import * as aes256 from 'aes256';

export default function encryptPhrase(phrase: string, key: string): string {
  const cipher = aes256.createCipher(key);

  if (typeof phrase === 'string') {
    return cipher.encrypt(phrase);
  } else {
    throw new Error('Invalid');
  }
}
