import type { Request, Response } from "express";
import { getStatsService } from "../services/statsService";

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await getStatsService();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
