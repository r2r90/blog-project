import { Request, Response, NextFunction } from "express";
import { DeviceConnectionRepository } from "../../repositories/device-secure-repository/device.connection.repository";

export async function fixConnectionDevice(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    await DeviceConnectionRepository.DeviceConnectionFixing(req.ip!, req.url);
    next();
  } catch (error) {
    next(error);
  }
}
