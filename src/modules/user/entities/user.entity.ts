import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "./role.entity";

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 120 })
  email!: string;

  @Column()
  passwordHash!: string; // store hash, not plain password

  @Column({ default: true })
  isActive!: boolean;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles!: Role[];
}
