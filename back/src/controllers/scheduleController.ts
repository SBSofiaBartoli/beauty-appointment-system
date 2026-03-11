import type { Request, Response } from "express";
import {
  getAllSchedulesService,
  createScheduleService,
  deleteScheduleService,
} from "../services/scheduleService";

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getAllSchedulesService();
    res.status(200).json(schedules);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = await createScheduleService(req.body);
    res.status(201).json(schedule);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    await deleteScheduleService(Number(req.params.id));
    res.status(200).json({ message: "Horario desactivado correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
