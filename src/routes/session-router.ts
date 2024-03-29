import { Request, Response, Router } from "express";
import { SessionRepository } from "../repositories/session-repository/session.repository";
import { HTTP_RESPONSE_CODES } from "../types/common";
import { JwtService } from "../services/jwt-service";
import { appConfig } from "../config/config";
import { SessionService } from "../services/session-service";
import { jwtRefreshTokenGuard } from "../middlewares/auth/jwt-refresh-token-guard";
import { checkOwnerValidator } from "../middlewares/validators/check-owner-validator";

export const sessionRouter = Router();

sessionRouter.get(
  "/",
  jwtRefreshTokenGuard,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    const jwtPayload = await JwtService.checkTokenValidation(
      token,
      appConfig.JWT_REFRESH_SECRET
    );

    const userId = jwtPayload?.userId;

    const devicesList = await SessionRepository.getAllSessions(userId!);
    devicesList
      ? res.send(devicesList).status(HTTP_RESPONSE_CODES.SUCCESS)
      : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
  }
);
sessionRouter.delete(
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

    const device = await SessionService.getSessionById(deviceIdToDelete);
    if (!device) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    }

    if (device?.userId !== userId) {
      res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
    }

    const isDeleted = await SessionService.deleteSession(deviceIdToDelete);

    isDeleted
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
  }
);
sessionRouter.delete("/", jwtRefreshTokenGuard, async (req, res) => {
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
  const result = await SessionService.deleteAllSessions(
    userId,
    deviceInfo.deviceId
  );

  result
    ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
    : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});
