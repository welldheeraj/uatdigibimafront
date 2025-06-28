import { parseCookies } from 'nookies';
import { decryptData } from './crypt';

export default async function handler(req, res) {
  try {
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.unused || null;
  if (encryptedToken) {
    // let decryptedToken = await decryptData(encryptedToken); 
    let decryptedToken = encryptedToken; 
    res.json({ status:true,authkey: decryptedToken });
  } else {
    res.json({status:false, authkey:'',error: 'Token not found' });
  }
} catch (error) {
  res.json({ status: false, authkey:'',error: error.message});
}
}
