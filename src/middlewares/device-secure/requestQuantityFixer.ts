import { Request, Response, NextFunction } from "express";
import { DeviceConnectionRepository } from "../../repositories/device-secure-repository/device.connection.repository";

export async function requestQuantityFixer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await DeviceConnectionRepository.deviceConnectionFixing(req.ip!, req.url);
    const requestCount =
      await DeviceConnectionRepository.deviceConnectionCounter(
        req.ip!,
        req.url
      );

    if (requestCount > 5) {
      res.sendStatus(429);
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
