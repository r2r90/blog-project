import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../services/jwt-service";
import { appConfig } from "../../config/config";
import { DeviceService } from "../../services/device-service";
import { HTTP_RESPONSE_CODES } from "../../models/common";

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

  const findDevice = await DeviceService.getDeviceById(deviceId);

  if (!findDevice) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }

  if (findDevice.userId !== userId) {
    res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
    return;
  }

  next();
};
