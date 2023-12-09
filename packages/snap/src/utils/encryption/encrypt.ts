import * as aes256 from 'aes256';

/**
 * Encrypts a phrase using a key.
 * @param - phrase The phrase to encrypt.
 * @param - key The key to encrypt the phrase with.
 * @returns - The encrypted phrase.
 */
export default function encryptPhrase(phrase: string, key: string): string {
  const cipher = aes256.createCipher(key);
  return cipher.encrypt(phrase);
}
