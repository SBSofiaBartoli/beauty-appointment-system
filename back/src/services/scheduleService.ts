import { scheduleRepository } from "../config/data-source";
import { IScheduleDto } from "../dto/ScheduleDto";
import { Schedule } from "../entities/Schedule";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const getAllSchedulesService = async (): Promise<Schedule[]> => {
  return await scheduleRepository.find({
    where: { isAvailable: true },
    order: { dayOfWeek: "ASC", time: "ASC" },
  });
};

export const createScheduleService = async (
  data: IScheduleDto,
): Promise<Schedule> => {
  if (data.dayOfWeek === 0)
    throw new Error("No se pueden crear horarios los domingos");

  const existing = await scheduleRepository.findOne({
    where: { dayOfWeek: data.dayOfWeek, time: data.time },
  });
  if (existing)
    throw new Error(
      `Ya existe un horario el ${DAY_NAMES[data.dayOfWeek]} a las ${data.time}`,
    );

  const schedule = scheduleRepository.create({ ...data, isAvailable: true });
  return await scheduleRepository.save(schedule);
};

export const deleteScheduleService = async (id: number): Promise<void> => {
  const schedule = await scheduleRepository.findOne({ where: { id } });
  if (!schedule) throw new Error("Horario no encontrado");
  schedule.isAvailable = false;
  await scheduleRepository.save(schedule);
};
