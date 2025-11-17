import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // e.g., 'admin', 'user'

  @ManyToMany(() => User, (u) => u.roles)
  users!: User[];
}
export default Role;
