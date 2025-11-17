// src/types/express.d.ts
import type { JwtUser } from '../http/middleware/auth';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtUser;
  }
}
