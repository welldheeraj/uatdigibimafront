import { destroyCookie  } from 'nookies';

export default async function handler(req, res) {
  
  if (parseCookies({ req })) {
    destroyCookie(null, 'unused');
    res.status(200).json({ message: 'logout success' });
  } else {
    res.status(404).json({ message: 'logout already' });
  }
}
