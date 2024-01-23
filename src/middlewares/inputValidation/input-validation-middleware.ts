import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formattedError = validationResult(req).formatWith(
    (error: ValidationError) => ({
      message: error.msg,
      field: error.type === "field" ? error.path : "unknown field",
    })
  );

  if (!formattedError.isEmpty()) {
    const errorMessages = formattedError.array({ onlyFirstError: true });
    res.status(400).send({ errorMessages: errorMessages });
    return;
  }

  return next();
};
