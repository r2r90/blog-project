import { NextFunction, Request, Response } from "express";

const login1 = "admin";
const password1 = "qwerty";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* if (req.headers["authorization"] !== "Basic YWRtaW4vcXdlcnR5") {
    res.sendStatus(401);
    return;
  }*/

  const auth = req.headers["authorization"];

  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const [basic, token] = auth?.split(" ");

  if (basic !== "basic") {
    res.sendStatus(401);
    return;
  }

  //admin:qwerty
  const decodedToken = Buffer.from(token, "base64").toString();

  const [login, password] = decodedToken.split(":");

  if (login !== login1 || password !== password1) {
    res.sendStatus(401);
    return;
  }

  return next();
};
