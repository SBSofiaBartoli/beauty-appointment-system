import { Router } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const serviceRouter = Router();

serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/", authenticate, authorize("admin"), createService);
serviceRouter.put("/:id", authenticate, authorize("admin"), updateService);
serviceRouter.delete("/:id", authenticate, authorize("admin"), deleteService);

export default serviceRouter;
