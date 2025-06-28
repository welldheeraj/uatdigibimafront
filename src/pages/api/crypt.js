
import CryptoJS from 'crypto-js';
const encryptionKey = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,';
const algorithm = 'AES';

export function encryptData(data) {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

export function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
