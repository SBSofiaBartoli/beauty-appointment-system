import type { Request, Response } from "express";
import {
  getAllServicesService,
  getServiceByIdService,
  createServiceService,
  updateServiceService,
  deleteServiceService,
} from "../services/serviceService";

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await getAllServicesService();
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await getServiceByIdService(Number(req.params.id));
    res.status(200).json(service);
  } catch (error: any) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await createServiceService(req.body);
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await updateServiceService(Number(req.params.id), req.body);
    res.status(200).json(service);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await deleteServiceService(Number(req.params.id));
    res.status(200).json({ message: "Servicio desactivado correctamente" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
