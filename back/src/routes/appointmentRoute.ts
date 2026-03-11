import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getUpcomingReminders,
} from "../controllers/appointmentController";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const appointmentRouter = Router();

appointmentRouter.get("/", authenticate, getAllAppointments);
appointmentRouter.get(
  "/reminders",
  authenticate,
  authorize("admin"),
  getUpcomingReminders,
);
appointmentRouter.get("/:id", authenticate, getAppointmentById);
appointmentRouter.post("/schedule", authenticate, createAppointment);
appointmentRouter.put("/cancel/:id", authenticate, cancelAppointment);

export default appointmentRouter;
