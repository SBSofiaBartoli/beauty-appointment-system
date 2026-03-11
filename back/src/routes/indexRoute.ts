import { Router } from "express";
import usersRouter from "./userRoute";
import appointmentRouter from "./appointmentRoute";
import serviceRouter from "./serviceRoute";
import scheduleRouter from "./scheduleRoute";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { getStats } from "../controllers/statsController";

const router: Router = Router();

router.use("/users", usersRouter);
router.use("/appointments", appointmentRouter);
router.use("/services", serviceRouter);
router.use("/schedules", scheduleRouter);
router.get("/admin/stats", authenticate, authorize("admin"), getStats);

export default router;
