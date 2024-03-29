import { NextFunction, Request, Response } from "express";
import { HTTP_RESPONSE_CODES } from "../../types/common";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/config";

export const recoveryCodeGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const recoveryCode = req.body.recoveryCode;

  if (!recoveryCode) {
    res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).send({
      errorsMessages: [{ message: "Invalid code", field: "recoveryCode" }],
    });
    return;
  }
  try {
    jwt.verify(recoveryCode, appConfig.EMAIL_RECOVERY_SECRET);
  } catch (e) {
    res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).send({
      errorsMessages: [{ message: "Invalid code", field: "recoveryCode" }],
    });
    return;
  }

  next();
};
