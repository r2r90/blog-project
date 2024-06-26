import { NextFunction, Request, Response } from "express";
import { HTTP_RESPONSE_CODES } from "../../types/common";

const login1 = "admin";
const password1 = "qwerty";

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    return;
  }

  const [basic, token] = auth?.split(" ");

  if (basic !== "Basic") {
    res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    return;
  }

  //admin:qwerty
  const decodedToken = Buffer.from(token, "base64").toString();

  const [login, password] = decodedToken.split(":");

  if (login !== login1 || password !== password1) {
    res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
    return;
  }

  return next();
};
