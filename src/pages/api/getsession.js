
import { withSessionRoute  } from '../lib/session';

export default withSessionRoute(async function meRoute(req, res) {
  if (req.session.token) {
    res.json({ token: req.session.token });
  } else {
    res.json({ message: 'Not logged in' });
  }
});
