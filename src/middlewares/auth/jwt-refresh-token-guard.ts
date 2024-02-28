import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../services/jwt.service";
import { HTTP_RESPONSE_CODES } from "../../types/common/common";
import { appConfig } from "../../config/config";
import { AuthRepository } from "../../repositories/auth-repositories/auth.repository";

export const jwtRefreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(HTTP_RESPONSE_CODES.UNAUTHORIZED)
      .send("Token is missed.");
  }

  const isValid = await jwtService.checkTokenValidation(
    token,
    appConfig.JWT_REFRESH_SECRET
  );

  if (!isValid) {
    return res
      .status(HTTP_RESPONSE_CODES.UNAUTHORIZED)
      .send("Token is not valid.");
  }

  const isTokenBlacklisted = await AuthRepository.findTokenInBlackList(token);
  if (!isTokenBlacklisted) {
    return res
      .status(HTTP_RESPONSE_CODES.UNAUTHORIZED)
      .send("Token already is used.");
  }

  req.userId = isValid.userId;
  return next();
};
