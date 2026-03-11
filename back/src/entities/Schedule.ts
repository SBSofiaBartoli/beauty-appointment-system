import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "schedules" })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column()
  time: string;

  @Column({ default: true })
  isAvailable: boolean;
}
