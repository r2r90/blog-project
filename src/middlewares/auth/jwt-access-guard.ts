import { jwtService } from "../../services/jwt.service";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { NextFunction, Response, Request } from "express";

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

  const userId = await jwtService.getUserIdByToken(token);

  if (!userId) {
    res.sendStatus(401);
    next();
  }
  req.user = await UserQueryRepository.getUserById(userId!.toString());
  next();
};
