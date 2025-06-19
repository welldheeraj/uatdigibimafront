
import { withSessionRoute  } from '../lib/session';

// export default withSessionRoute(async function loginRoute(req, res) {
//     //const { username } = req.body;
//     // res.json({ ok: true });
//     req.session.token = '454545';
//     await req.session.save();
//     res.json({ ok: true });
//   });

export default withSessionRoute(async function setToken(req,res){
     const { token } = req.body;
     if(!token){
      return res.json({message:"Token is required"});
     }

     req.session.token = token;
     await req.session.save();
     res.json({ status: true });
})