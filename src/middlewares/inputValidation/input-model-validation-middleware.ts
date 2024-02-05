import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { ErrorMessageType } from "../../models/common/common";

export const inputModelValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formattedError = validationResult(req).formatWith(
    (error: ValidationError) => ({
      message: error.msg,
      field: error.type === "field" ? error.path : "unknown",
    })
  );

  if (!formattedError.isEmpty()) {
    const errorsMessages: ErrorMessageType[] = formattedError.array({
      onlyFirstError: true,
    });
    res.status(400).send({ errorsMessages: errorsMessages });
    return;
  }

  return next();
};
