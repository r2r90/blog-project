import { Request, Response, Router } from "express";
import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { HTTP_RESPONSE_CODES } from "../models/common";

export const devicesRouter = Router();

devicesRouter.get("/", async (req: Request, res: Response) => {
  const devicesList = await DeviceRepository.getAllDevices();
  devicesList
    ? res.send(devicesList).status(200)
    : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
});
devicesRouter.delete("/", (req, res) => {});
devicesRouter.delete("/:id", (req, res) => {});
