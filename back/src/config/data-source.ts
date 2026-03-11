import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Credential } from "../entities/Credential";
import { Appointment } from "../entities/Appointment";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "./envs";
import { Service } from "../entities/Service";
import { Schedule } from "../entities/Schedule";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "localhost",
  port: DB_PORT || 5432,
  username: DB_USERNAME || "postgres",
  password: DB_PASSWORD || "Athena12",
  database: DB_NAME || "beauty_salon",
  synchronize: true,
  dropSchema: false,
  logging: false,
  entities: [User, Credential, Appointment, Service, Schedule],
  subscribers: [],
  migrations: [],
});

export const userRepository = AppDataSource.getRepository(User);
export const credentialRepository = AppDataSource.getRepository(Credential);
export const appointmentRepository = AppDataSource.getRepository(Appointment);
export const serviceRepository = AppDataSource.getRepository(Service);
export const scheduleRepository = AppDataSource.getRepository(Schedule);
