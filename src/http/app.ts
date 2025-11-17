import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataSource from '../db/data-source';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import { verifyJwt, requireRole } from './middleware/auth';

dotenv.config();

async function bootstrap() {
  // 1) Initialize DB connection
  await dataSource.initialize();

  // 2) Create app + core middlewares
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 3) Health/public
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.get('/ping', (_req, res) => res.json({ ok: true }));

  // 4) Feature routers
  // Auth (register/login)
  app.use('/auth', authRouter);

  // Admin router (grant/revoke role, etc.)
  app.use('/admin', adminRouter);

  // 5) Example protected routes
  // Current user (requires valid JWT)
  app.get('/me', verifyJwt, (req: Request, res: Response) => {
    // req.user is typed via your global augmentation in middleware/auth.ts
    res.json({
      id: req.user!.sub,
      email: req.user!.email,
      roles: req.user!.roles,
    });
  });

  // Admin-only
  app.get('/admin/ping', verifyJwt, requireRole('admin'), (_req, res) => {
    res.json({ ok: true, scope: 'admin' });
  });

  // Manager OR Admin
  app.get('/mgmt/ping', verifyJwt, requireRole('manager', 'admin'), (_req, res) => {
    res.json({ ok: true, scope: 'manager-or-admin' });
  });

  // 6) 404
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // 7) Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // 8) Start server
  const port = Number(process.env.PORT ?? 5001);
  app.listen(port, () => console.log(`Auth API listening on :${port}`));

  // 9) Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      if (dataSource.isInitialized) await dataSource.destroy();
    } finally {
      process.exit(0);
    }
  });
}

bootstrap().catch((e) => {
  console.error('Fatal bootstrap error:', e);
  process.exit(1);
});
