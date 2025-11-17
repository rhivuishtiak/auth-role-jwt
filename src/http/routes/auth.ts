// src/http/routes/auth.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import dataSource from '../../db/data-source';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

const router = Router();

// ---- typed config ----
const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-change-me';

// Make TS happy about expiresIn type (string like "24h" is valid)
const ACCESS_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as any) || '24h';

// ---- helpers ----
const userRepo = () => dataSource.getRepository(User);
const roleRepo = () => dataSource.getRepository(Role);

function signAccessToken(u: User): string {
  // roles may be lazy-loaded or missing; guard defensively
  const roleNames = Array.isArray(u.roles) ? u.roles.map(r => r.name) : [];
  return jwt.sign(
    { sub: u.id, email: u.email, roles: roleNames },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

// ---- routes ----

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, roles } = req.body as {
      email?: string;
      password?: string;
      roles?: string[]; // optional, e.g. ["user"] or ["admin"]
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const existing = await userRepo().findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Resolve roles (default to "user" if none provided)
    const wanted = (roles && roles.length ? roles : ['user']).map(r => r.toLowerCase());
    const roleEntities = await roleRepo().findBy({ name: (wanted as any) });

    if (roleEntities.length === 0) {
      return res.status(400).json({ error: 'No valid roles found' });
    }

    // Use explicit instance to avoid the TypeORM create(array) overload confusion
    const u = new User();
    u.email = email;
    u.passwordHash = passwordHash;
    u.isActive = true;
    u.roles = roleEntities;

    await userRepo().save(u);

    // Optionally issue a token on registration
    const token = signAccessToken(u);
    return res.status(201).json({ id: u.id, email: u.email, roles: roleEntities.map(r => r.name), token });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Need roles for JWT payload; include relation
    const u = await userRepo().findOne({
      where: { email },
      relations: { roles: true },
    });

    if (!u) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, u.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signAccessToken(u);
    const roles = (u.roles ?? []).map(r => r.name);

    return res.json({ token, roles });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
