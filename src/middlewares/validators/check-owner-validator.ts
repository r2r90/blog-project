import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/auth-service";
import { JwtService } from "../../services/jwt-service";
import { appConfig } from "../../config/config";
import { DeviceRepository } from "../../repositories/device-repository/device.repository";
import { DeviceService } from "../../services/device-service";

export const checkOwnerValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  const jwtPayload = await JwtService.checkTokenValidation(
    token,
    appConfig.JWT_REFRESH_SECRET
  );

  const userId = jwtPayload?.userId;
  const deviceId = req.params.id;

  const isDeviceExist = await DeviceService.getDeviceById(deviceId);

  if (!isDeviceExist) {
    res.sendStatus(404);
    return;
  }
};
