import { Request, Response, NextFunction } from "express";
import { SessionRepository } from "../../repositories/session-repository/session.repository";
import { HTTP_RESPONSE_CODES } from "../../types/common";

export async function requestQuantityFixer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await SessionRepository.requestFromDeviceFixing(req.ip!, req.url);
    const requestCount = await SessionRepository.deviceRequestCounter(
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
