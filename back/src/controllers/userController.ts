import type { Request, Response } from "express";
import {
  getAllUsersService,
  createUserService,
  getUserByIdService,
  loginUserService,
} from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await getUserByIdService(Number(id));
    res.status(200).json({ user });
  } catch (error: any) {
    if (error.message == "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await createUserService(req.body);
    res.status(201).json({ message: "Usuario creado correctamente", newUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await loginUserService(req.body.username, req.body.password);
    res.status(200).json({ login: true, ...user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
