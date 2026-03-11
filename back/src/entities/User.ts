import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Credential } from "./Credential";
import { Appointment } from "./Appointment";

export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
}

@Entity({
  name: "users",
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column()
  birthdate: Date;

  @Column("integer")
  nDni: number;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @OneToOne(() => Credential, (credential) => credential.user)
  @JoinColumn()
  credential: Credential;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];
}
