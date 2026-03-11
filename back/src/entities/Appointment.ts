import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum AppStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
}

@Entity({
  name: "appointments",
})
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date;

  @Column()
  time: string;

  @Column()
  treatment: string;

  @Column({
    type: "enum",
    enum: AppStatus,
    default: AppStatus.ACTIVE,
  })
  status: AppStatus;

  @Column({ default: false })
  reminderSent: boolean;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;
}
