import { Request, Response, Router } from "express";
import { HTTP_RESPONSE_CODES, RequestWithBody } from "../types/common/common";
import { LoginInputType } from "../types/auth/login.input";
import { AuthService } from "../services/auth.service";
import { loginOrEmailValidation } from "../middlewares/validators/auth-login-validator";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";

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
    res.send(loginResult).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

authRouter.get("/me", jwtAccessGuard, async (req: Request, res: Response) => {
  // res.status(200).send(userInfo);
});
