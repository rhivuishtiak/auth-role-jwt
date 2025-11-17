import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("roles")
@Unique(["name"])
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50 })
  name!: string; // e.g. "admin", "manager", "customer"
}
