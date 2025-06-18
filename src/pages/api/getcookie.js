import { getCookie } from 'cookies-next';

export default function handler(req, res) {
  const token = getCookie('token', { req, res });
  res.json({ status: true, message: 'Cookie get', token:token });
}
