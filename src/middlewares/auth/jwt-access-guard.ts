import { JwtService } from "../../services/jwt-service";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { NextFunction, Request, Response } from "express";
import { HTTP_RESPONSE_CODES } from "../../types/common";

export const jwtAccessGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await JwtService.getUserIdByAccessToken(token);
  const user = await UserQueryRepository.getUserById(userId!);

  if (!user) {
    res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    return;
  }

  req.userId = user._id.toHexString();
  next();
};
