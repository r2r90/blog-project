import { Request, Response, Router } from "express";
import { DeviceRepository } from "../repositories/device-repository/device.repository";

export const devicesRouter = Router();

devicesRouter.get("/", async (req: Request, res: Response) => {
  const outputFromRepo = await DeviceRepository.getAllDevices();
});
devicesRouter.delete("/", (req, res) => {});
devicesRouter.delete("/:id", (req, res) => {});
