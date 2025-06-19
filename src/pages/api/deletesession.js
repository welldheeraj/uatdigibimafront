import { withSessionRoute  } from '../lib/session'; 
export default withSessionRoute(async function logoutRoute(req, res) {
  await req.session.destroy(); 
    res.json({ status: true,message:"Token deleted" })
});