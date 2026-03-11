import { FindManyOptions } from "typeorm";
import { appointmentRepository } from "../config/data-source";
import type { IAppointmentDto } from "../dto/AppointmentDto";
import { Appointment, AppStatus } from "../entities/Appointment";
import { getUserByIdService } from "./userService";

export const getAllAppointmentsService = async (
  userId: number | null = null,
): Promise<Appointment[]> => {
  const options: FindManyOptions<Appointment> = {
    relations: ["user"],
    order: {
      date: "ASC",
      time: "ASC",
    },
  };

  if (userId) {
    options.where = {
      user: { id: userId },
    };
  }

  const appointments = await appointmentRepository.find(options);
  if (appointments.length === 0) throw new Error("No hay turno disponibles");
  return appointments;
};

export const getAppointmentByIdService = async (
  id: number,
): Promise<Appointment> => {
  const appointment: null | Appointment = await appointmentRepository.findOne({
    where: { id },
    relations: ["user"],
  });
  if (!appointment) throw new Error("Turno no encontrado");
  return appointment;
};

export const createAppointmentService = async (
  appData: IAppointmentDto,
): Promise<Appointment> => {
  const foundUser = await getUserByIdService(appData.userId);
  if (!foundUser) {
    throw new Error("Usuario no encontrado");
  }

  const appointmentDate = new Date(appData.date + "T00:00:00");
  const dayOfWeek = appointmentDate.getUTCDay();
  if (dayOfWeek === 0) {
    throw new Error("No se pueden reservar turnos los domingos");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw new Error("No se pueden reservar turnos en fechas pasadas");
  }

  const existing = await appointmentRepository.findOne({
    where: {
      date: appointmentDate as any,
      time: appData.time,
      status: AppStatus.ACTIVE,
    },
  });
  if (existing)
    throw new Error("Ya existe un turno reservado en esa fecha y horario");

  const newAppointment: Appointment = await appointmentRepository.create({
    date: appData.date,
    time: appData.time,
    treatment: appData.treatment,
    user: foundUser,
    status: AppStatus.ACTIVE,
  });
  return await appointmentRepository.save(newAppointment);
};

export const cancelAppointmentService = async (
  appId: number,
): Promise<number> => {
  const appointment = await getAppointmentByIdService(appId);
  if (appointment.status === AppStatus.CANCELLED)
    throw new Error("El turno ya estaba cancelado");
  appointment.status = AppStatus.CANCELLED;
  const results = await appointmentRepository.save(appointment);
  return results.id;
};

export const getUpcomingAppointmentsService = async (): Promise<
  Appointment[]
> => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  return await appointmentRepository
    .createQueryBuilder("appointment")
    .leftJoinAndSelect("appointment.user", "user")
    .where("appointment.date = :date", {
      date: tomorrow.toISOString().split("T")[0],
    })
    .andWhere("appointment.status = :status", { status: AppStatus.ACTIVE })
    .andWhere("appointment.reminderSent = false")
    .getMany();
};
