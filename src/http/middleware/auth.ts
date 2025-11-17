import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// The shape of the JWT we issue
export type JwtUser = JwtPayload & {
  sub: string;       // user id (uuid)
  email: string;
  roles: string[];   // e.g. ['admin', 'user']
};

// Augment Express.Request so req.user is typed
declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

/** Verify JWT and attach `req.user` */
export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization ?? '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });

  try {
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload; // { sub, email, roles, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Require at least ONE of the given roles */
export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const has = (req.user.roles ?? []).some(r => allowed.includes(r));
    if (!has) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    return next();
  };
}

// Back-compat export name
export const authMiddleware = verifyJwt;
