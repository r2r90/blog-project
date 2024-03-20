import { Request, Response, Router } from "express";
import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { HTTP_RESPONSE_CODES } from "../models/common";
import { JwtService } from "../services/jwt-service";
import { appConfig } from "../config/config";
import { DeviceService } from "../services/device-service";
import { jwtRefreshTokenGuard } from "../middlewares/auth/jwt-refresh-token-guard";
import { checkOwnerValidator } from "../middlewares/validators/check-owner-validator";
import { AuthRepository } from "../repositories/auth-repositories/auth.repository";

export const devicesRouter = Router();

devicesRouter.get(
  "/",
  jwtRefreshTokenGuard,
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
devicesRouter.delete(
  "/:id",
  jwtRefreshTokenGuard,
  checkOwnerValidator,
  async (req, res) => {
    const deviceIdToDelete = req.params.id;
    const token = req.cookies.refreshToken;

    const jwtPayload = await JwtService.checkTokenValidation(
      token,
      appConfig.JWT_REFRESH_SECRET
    );

    const userId = jwtPayload?.userId;

    const device = await DeviceService.getDeviceById(deviceIdToDelete);
    if (!device) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    }

    if (device?.userId !== userId) {
      res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
    }

    await AuthRepository.addRefreshTokenToBlackList(token);
    const isDeleted = await DeviceService.deleteDevice(deviceIdToDelete);

    isDeleted
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
  }
);
devicesRouter.delete("/", jwtRefreshTokenGuard, async (req, res) => {
  const token = req.cookies.refreshToken;

  const jwtPayload = await JwtService.getParamsFromRefreshToken(token);

  if (!jwtPayload) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }

  const { userId, deviceInfo } = jwtPayload;
  if (!userId) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }
  const result = await DeviceService.deleteAllDevices(
    userId,
    deviceInfo.deviceId
  );

  result
    ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});
