import { parseCookies } from 'nookies';
import { decryptData } from './crypt';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.unused || null;
  if (encryptedToken) {
    const decryptedToken = decryptData(encryptedToken); 
    console.log('Decrypted Token:', decryptedToken);
    res.status(200).json({ cookie: decryptedToken });
  } else {
    res.status(404).json({ error: 'Token not found' });
  }
}
