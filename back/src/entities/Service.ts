import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "services" })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column()
  durationMinutes: number;

  @Column({ default: true })
  isActive: boolean;
}
