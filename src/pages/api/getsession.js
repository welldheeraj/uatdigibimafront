import { parseCookies } from 'nookies';
import { decryptData } from './crypt'; // Example decryption utility function

export default async function handler(req, res) {
  // Retrieve cookies and decrypt token
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.unused || null;

  if (encryptedToken) {
    const decryptedToken = decryptData(encryptedToken); // Example function to decrypt token
    // Use decryptedToken in your application logic
    console.log('Decrypted Token:', decryptedToken);
    res.status(200).json({ cookie: decryptedToken });
  } else {
    res.status(404).json({ error: 'Token not found' });
  }
}
