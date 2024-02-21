import { Request, Response, Router } from "express";
import { HTTP_RESPONSE_CODES, RequestWithBody } from "../types/common/common";
import { LoginInputType } from "../types/auth/login.input";
import { AuthService } from "../services/auth.service";
import { loginOrEmailValidation } from "../middlewares/validators/auth-login-validator";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";
import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { userValidator } from "../middlewares/validators/user-validator";
import { registerValidator } from "../middlewares/validators/register-validator";
import { registerCodeConfirmation } from "../middlewares/validators/register-code-confirmation";

export const authRouter = Router();

authRouter.post(
  "/registration",

  userValidator(),
  registerValidator(),
  async (req: RequestWithBody<UserCreateInputType>, res: Response) => {
    const { login, email, password } = req.body;
    const newUser = await AuthService.registerUser({ login, email, password });

    if (!newUser) {
      res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
      return;
    }
    res.status(HTTP_RESPONSE_CODES.NO_CONTENT).send("OK!");
  }
);

authRouter.post(
  "/registration-confirmation",
  registerCodeConfirmation(),
  async (req, res) => {
    const result = await AuthService.confirmEmail(req.body.code);

    if (!result) {
      res.sendStatus(400);
      return;
    }

    res.status(204).send("OK!");
  }
);

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
