import { Router } from "express";
import {
  getAllSchedules,
  createSchedule,
  deleteSchedule,
} from "../controllers/scheduleController";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
const scheduleRouter = Router();

scheduleRouter.get("/", getAllSchedules);
scheduleRouter.post("/", authenticate, authorize("admin"), createSchedule);
scheduleRouter.delete("/:id", authenticate, authorize("admin"), deleteSchedule);

export default scheduleRouter;
