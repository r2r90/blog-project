import { jwtService } from "../../services/jwt.service";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { NextFunction, Request, Response } from "express";

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

  const userId = await jwtService.getUserIdByAccessToken(token);
  const user = await UserQueryRepository.getUserById(userId!);

  if (!user) {
    res.sendStatus(401);
    return;
  }

  req.userId = user._id.toHexString();
  next();
};
