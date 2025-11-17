import { Router } from 'express';
import dataSource from '../../db/data-source';
import { verifyJwt, requireRole } from '../middleware/auth';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

const router = Router();

// All admin routes require a valid JWT and 'admin' role
router.use(verifyJwt, requireRole('admin'));

/** POST /admin/grant-role { email, role } */
router.post('/grant-role', async (req, res) => {
  const { email, role } = req.body as { email?: string; role?: string };
  if (!email || !role) return res.status(400).json({ error: 'email and role are required' });

  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const user = await userRepo.findOne({ where: { email }, relations: ['roles'] });
  if (!user) return res.status(404).json({ error: 'User not found' });

  let r = await roleRepo.findOne({ where: { name: role } });
  if (!r) {
    r = roleRepo.create({ name: role });
    await roleRepo.save(r);
  }

  const alreadyHas = (user.roles || []).some(x => x.name === r!.name);
  if (!alreadyHas) {
    user.roles = [...(user.roles || []), r!];
    await userRepo.save(user);
  }

  return res.json({ ok: true, user: { id: user.id, email: user.email, roles: user.roles.map(x => x.name) } });
});

/** POST /admin/revoke-role { email, role } */
router.post('/revoke-role', async (req, res) => {
  const { email, role } = req.body as { email?: string; role?: string };
  if (!email || !role) return res.status(400).json({ error: 'email and role are required' });

  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email }, relations: ['roles'] });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.roles = (user.roles || []).filter(r => r.name !== role);
  await userRepo.save(user);

  return res.json({ ok: true, user: { id: user.id, email: user.email, roles: user.roles.map(x => x.name) } });
});

export default router;
