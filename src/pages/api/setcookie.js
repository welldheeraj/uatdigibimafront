import { setCookie } from 'cookies-next';

export default function handler(req, res) {
  setCookie("token", "abc123", { req, res, httpOnly: false }); // remove httpOnly for client access
  res.json({ status:true,message: 'Cookie Set' });
}