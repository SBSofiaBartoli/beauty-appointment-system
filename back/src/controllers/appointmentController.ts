import type { Request, Response } from "express";
import {
  cancelAppointmentService,
  createAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  getUpcomingAppointmentsService,
} from "../services/appointmentService";
import { AuthRequest } from "../../middlewares/authenticate";

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const userId = isAdmin
      ? req.query.userId
        ? Number(req.query.userId)
        : null
      : req.user!.id;
    const appointments = await getAllAppointmentsService(userId);
    res.status(200).json(appointments);
  } catch (error: any) {
    if (error.message == "No hay turnos disponibles") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await getAppointmentByIdService(Number(req.params.id));
    if (req.user?.role !== "admin" && appointment.user?.id !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para ver este turno" });
    }
    res.status(200).json({ appointment });
  } catch (error: any) {
    if (error.message == "Turno no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const userId =
      req.user?.role === "admin"
        ? (req.body.userId ?? req.user.id)
        : req.user!.id;
    const appointment = await createAppointmentService({ ...req.body, userId });
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await getAppointmentByIdService(Number(req.params.id));
    if (req.user?.role !== "admin" && appointment.user?.id !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para cancelar este turno" });
    }
    const id = await cancelAppointmentService(Number(req.params.id));
    res.status(200).json({ message: "Turno cancelado correctamente", id });
  } catch (error: any) {
    if (error.message == "Turno no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUpcomingReminders = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await getUpcomingAppointmentsService();
    res.status(200).json({ count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
