import { Response, Router } from "express";
import { HTTP_RESPONSE_CODES, RequestWithBody } from "../models/common/common";
import { LoginInputType } from "../models/auth/input";
import { AuthService } from "../services/auth.service";
import { loginOrEmailValidation } from "../middlewares/validators/auth-login-validator";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation(),
  async (req: RequestWithBody<LoginInputType>, res: Response) => {
    const loginResult = await AuthService.login(req.body);

    if (!loginResult) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
