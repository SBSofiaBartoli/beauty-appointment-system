import {
  appointmentRepository,
  serviceRepository,
} from "../config/data-source";
import { AppStatus } from "../entities/Appointment";

export const getStatsService = async () => {
  const total = await appointmentRepository.count();
  const active = await appointmentRepository.count({
    where: { status: AppStatus.ACTIVE },
  });
  const cancelled = await appointmentRepository.count({
    where: { status: AppStatus.CANCELLED },
  });

  const appointments = await appointmentRepository.find({
    where: { status: AppStatus.ACTIVE },
    relations: ["user"],
  });
  const services = await serviceRepository.find();

  let estimatedRevenue = 0;
  for (const app of appointments) {
    const service = services.find((s) => s.name === app.treatment);
    if (service) estimatedRevenue += Number(service.price);
  }

  const byMonth = await appointmentRepository
    .createQueryBuilder("appointment")
    .select("TO_CHAR(appointment.date, 'YYYY-MM')", "month")
    .addSelect("COUNT(*)", "count")
    .groupBy("month")
    .orderBy("month", "DESC")
    .limit(6)
    .getRawMany();

  const topTreatments = await appointmentRepository
    .createQueryBuilder("appointment")
    .select("appointment.treatment", "treatment")
    .addSelect("COUNT(*)", "count")
    .where("appointment.status = :status", { status: AppStatus.ACTIVE })
    .groupBy("appointment.treatment")
    .orderBy("count", "DESC")
    .limit(5)
    .getRawMany();

  return {
    total,
    active,
    cancelled,
    estimatedRevenue,
    byMonth,
    topTreatments,
  };
};
