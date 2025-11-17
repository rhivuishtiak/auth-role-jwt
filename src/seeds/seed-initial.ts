import 'reflect-metadata';
import { config } from 'dotenv';
import dataSource from '../db/data-source';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import bcrypt from 'bcryptjs';

config({ path: '.env' });

async function run() {
  await dataSource.initialize();
  const roleRepo: Repository<Role> = dataSource.getRepository(Role);
  const userRepo: Repository<User> = dataSource.getRepository(User);

  // 1) Ensure base roles exist
  const roleNames = ['admin', 'user'];
  const roles: Role[] = [];
  for (const name of roleNames) {
    let role = await roleRepo.findOne({ where: { name } });
    if (!role) {
      role = roleRepo.create({ name });
      await roleRepo.save(role);
      console.log(`Created role: ${name}`);
    } else {
      console.log(`Role exists: ${name}`);
    }
    roles.push(role);
  }

  // 2) Create a test admin user if missing
  const email = 'admin@example.com';
  const plain = 'Admin@12345'; // change later
  let admin = await userRepo.findOne({ where: { email }, relations: { roles: true } });

  if (!admin) {
    const passwordHash = await bcrypt.hash(plain, 10);
    admin = userRepo.create({
      email,
      passwordHash,
      roles: roles.filter(r => r.name === 'admin'),
    });
    await userRepo.save(admin);
    console.log(`Created admin user: ${email} / ${plain}`);
  } else {
    // ensure it has admin role
    const hasAdmin = admin.roles?.some(r => r.name === 'admin');
    if (!hasAdmin) {
      admin.roles = [...(admin.roles ?? []), roles.find(r => r.name === 'admin')!];
      await userRepo.save(admin);
      console.log(`Added admin role to existing user: ${email}`);
    } else {
      console.log(`Admin user already present: ${email}`);
    }
  }

  await dataSource.destroy();
  console.log('Seeding done.');
}

run().catch(async (e) => {
  console.error(e);
  try { await dataSource.destroy(); } catch {}
  process.exit(1);
});
