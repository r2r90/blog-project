import { Request, Response, NextFunction } from "express";
import { deviceConnectCollection } from "../../db/db";
import { JwtService } from "../../services/jwt-service";
import { appConfig } from "../../config/config";
import { HTTP_RESPONSE_CODES } from "../../models/common";

export async function deviceOwnerCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const jwtPayload = await JwtService.checkTokenValidation(
    token,
    appConfig.JWT_REFRESH_SECRET
  );

  const deviceId = req.params.id;
  const userId = jwtPayload!.userId;

  const findDevice = await deviceConnectCollection.findOne({
    deviceId,
  });

  if (!findDevice) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }

  if (findDevice?.deviceId !== deviceId) {
    res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
    return;
  }

  next();
}
