import { parseCookies, destroyCookie } from 'nookies';

export default async function handler(req, res) {
  try {
    const cookies = parseCookies({ req });

    if (cookies.unused) {
      destroyCookie({ res }, 'unused', { path: '/' });

      res.json({ status: true, message: 'Logout successfully' });
    } else {
      res.json({ status: false, message: 'Already logged out' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Logout failed', error: error.message });
  }
}
