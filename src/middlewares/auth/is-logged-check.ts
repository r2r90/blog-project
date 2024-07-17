import { JwtService } from "../../services/jwt-service";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { NextFunction, Request, Response } from "express";

export const isLoggedCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const userId = await JwtService.getUserIdByAccessToken(token);
    const user = await UserQueryRepository.getUserById(userId!);
    if (user) {
      req.userId = user._id.toHexString();
    } else {
      req.userId = "";
    }
  }

  next();
};
