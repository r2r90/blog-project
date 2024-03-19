import { Request, Response, Router } from "express";
import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { HTTP_RESPONSE_CODES } from "../models/common";
import { requestQuantityFixer } from "../middlewares/device-secure/requestQuantityFixer";
import { JwtService } from "../services/jwt-service";
import { appConfig } from "../config/config";

export const devicesRouter = Router();

devicesRouter.get(
  "/",
  requestQuantityFixer,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

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
devicesRouter.delete("/", (req, res) => {});
devicesRouter.delete("/:id", (req, res) => {});
