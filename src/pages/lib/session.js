import { getIronSession } from 'iron-session';
import { sessionOptions } from './sessionconfig';

export function withSessionRoute(handler) {
  return async function (req, res) {
    req.session = await getIronSession(req, res, sessionOptions);
    return handler(req, res);
  };
}
