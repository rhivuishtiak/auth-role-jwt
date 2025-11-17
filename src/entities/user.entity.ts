// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { RefreshToken } from './RefreshToken.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120, unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToMany(() => Role, (r) => r.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[];

  @OneToMany(() => RefreshToken, (rt) => rt.user, { cascade: true })
  refreshTokens!: RefreshToken[];
}

export default User;
