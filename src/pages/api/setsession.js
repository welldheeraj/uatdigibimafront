import { setCookie } from 'nookies';
import { encryptData, decryptData } from './crypt'; // Example encryption utility functions

export default async function handler(req, res) {
  const {token} = req.body;
  const encryptedToken = encryptData(token);
  setCookie({ res }, 'unused', encryptedToken, {
    httpOnly: true,      // Prevents cookie access from JavaScript
    secure: true,        // Ensures cookie is sent over HTTPS only
    path: '/',           // Adjust path as per your requirements
    sameSite: 'strict',  // Adjust sameSite policy as per your security needs
    maxAge: 60 * 60 * 24 * 7, // Max age of the cookie in seconds (e.g., 7 days)
  });

  res.status(200).json({ message: 'Cookie set successfully' });
}
