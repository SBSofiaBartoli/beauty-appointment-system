import { Router } from "express";
import {
  registerUser,
  getAllUsers,
  getUserById,
  loginUser,
} from "../controllers/userController";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const usersRouter = Router();

usersRouter.get("/", authenticate, authorize("admin"), getAllUsers);
usersRouter.get("/:id", authenticate, getUserById);
usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

export default usersRouter;
