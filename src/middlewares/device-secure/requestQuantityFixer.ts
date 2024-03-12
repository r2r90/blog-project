import { Request, Response, NextFunction } from "express";
import { DeviceRepository } from "../../repositories/device-repository/device.repository";
import { HTTP_RESPONSE_CODES } from "../../models/common";

export async function requestQuantityFixer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await DeviceRepository.requestFromDeviceFixing(req.ip!, req.url);
    const requestCount = await DeviceRepository.deviceRequestCounter(
      req.ip!,
      req.url
    );

    if (requestCount > 5) {
      res.sendStatus(HTTP_RESPONSE_CODES.TOO_MANY_REQUESTS);
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}
