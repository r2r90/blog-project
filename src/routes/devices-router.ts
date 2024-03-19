import { Request, Response, Router } from "express";
import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { HTTP_RESPONSE_CODES } from "../models/common";
import { requestQuantityFixer } from "../middlewares/device-secure/requestQuantityFixer";
import { JwtService } from "../services/jwt-service";
import { appConfig } from "../config/config";
import { DeviceService } from "../services/device-service";

export const devicesRouter = Router();

devicesRouter.get(
  "/",
  requestQuantityFixer,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    }

    const jwtPayload = await JwtService.checkTokenValidation(
      token,
      appConfig.JWT_REFRESH_SECRET
    );

    const userId = jwtPayload?.userId;

    const devicesList = await DeviceRepository.getAllDevices(userId!);
    devicesList
      ? res.send(devicesList).status(HTTP_RESPONSE_CODES.SUCCESS)
      : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
  }
);
devicesRouter.delete("/:id", async (req, res) => {
  const deviceIdToDelete = req.params.id;

  const deleteDevice = await DeviceService.deleteDevice(deviceIdToDelete);

  deleteDevice
    ? res.status(HTTP_RESPONSE_CODES.SUCCESS)
    : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});
devicesRouter.delete("/", (req, res) => {});
