import 'reflect-metadata';
import dataSource from '../db/data-source';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import bcrypt from 'bcryptjs';

async function main() {
  await dataSource.initialize();

  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  // Ensure base roles exist
  await roleRepo.upsert([{ name: 'admin' }, { name: 'user' }], ['name']);
  const adminRole = await roleRepo.findOneByOrFail({ name: 'admin' });
  const userRole  = await roleRepo.findOneByOrFail({ name: 'user'  });

  // Create an admin user if missing
  const email = 'admin@example.com';
  let admin = await userRepo.findOne({ where: { email }, relations: ['roles'] });
  if (!admin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    admin = userRepo.create({ email, passwordHash, roles: [adminRole] });
    await userRepo.save(admin);
    console.log('Created admin user:', email, '(password: Admin@123)');
  } else {
    console.log('Admin already exists:', email);
  }

  // Optional: create a normal user
  const userEmail = 'user@example.com';
  let normal = await userRepo.findOne({ where: { email: userEmail }, relations: ['roles'] });
  if (!normal) {
    const passwordHash = await bcrypt.hash('User@123', 10);
    normal = userRepo.create({ email: userEmail, passwordHash, roles: [userRole] });
    await userRepo.save(normal);
    console.log('Created user:', userEmail, '(password: User@123)');
  } else {
    console.log('User already exists:', userEmail);
  }

  await dataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
