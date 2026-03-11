import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para realizar esta acción" });
    }
    next();
  };
};
