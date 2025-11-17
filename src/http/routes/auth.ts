import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type Secret } from 'jsonwebtoken';
import dataSource from '../../db/data-source';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, roles = ['user'] } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const exists = await userRepo.findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already taken' });

  const passwordHash = await bcrypt.hash(password, 10);

  const roleEntities: Role[] = [];
  for (const name of roles) {
    let r = await roleRepo.findOne({ where: { name } });
    if (!r) {
      r = roleRepo.create({ name });
      await roleRepo.save(r);
    }
    roleEntities.push(r);
  }

  const user = userRepo.create({ email, passwordHash, roles: roleEntities });
  await userRepo.save(user);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    roles: roleEntities.map(r => r.name),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { email },
    relations: ['roles'],
  });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const secretEnv = process.env.JWT_SECRET;
  if (!secretEnv) return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
  const secret: Secret = secretEnv;

  // Build an expiresIn that satisfies the strict type: number | StringValue
  // Accepts "24h", "7d", etc. (patterned string), or seconds as a number.
  const envExp = process.env.JWT_EXPIRES ?? '24h';
  const expiresInOpt: Parameters<typeof jwt.sign>[2] extends infer T
    ? T extends { expiresIn?: infer U }
      ? U
      : never
    : never =
    /^\d+$/.test(envExp) ? Number(envExp) : (envExp as any);

  const payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles.map(r => r.name),
  };

  const token = jwt.sign(payload, secret, { expiresIn: expiresInOpt });
  return res.json({ token, roles: payload.roles });
});

export default router;
