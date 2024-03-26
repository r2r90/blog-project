import { Request, Response, Router } from "express";
import { HTTP_RESPONSE_CODES, RequestWithBody } from "../types/common";
import { DeviceInfoType, LoginInputType } from "../types/auth/login.input";
import { AuthService } from "../services/auth-service";
import { loginOrEmailValidation } from "../middlewares/validators/auth-login-validator";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";
import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { userValidator } from "../middlewares/validators/user-validator";
import { registerValidator } from "../middlewares/validators/register-validator";
import { registerCodeConfirmation } from "../middlewares/validators/register-code-confirmation";
import { EmailConfirmationCode } from "../types/auth/email.confirmation";
import { resendEmailValidator } from "../middlewares/validators/resend-email-validator";
import { jwtRefreshTokenGuard } from "../middlewares/auth/jwt-refresh-token-guard";
import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { AuthRepository } from "../repositories/auth-repositories/auth.repository";
import { requestQuantityFixer } from "../middlewares/device-secure-guard/requestQuantityFixer";
import { JwtService } from "../services/jwt-service";
import { SessionService } from "../services/session-service";

import dotenv from "dotenv";
import { emailValidation } from "../middlewares/validators/email-validator";
import { newPasswordValidation } from "../middlewares/validators/new-password-validator";

dotenv.config();

export const authRouter = Router();

authRouter.post(
  "/registration",
  requestQuantityFixer,
  userValidator(),
  registerValidator(),
  async (req: RequestWithBody<UserCreateInputType>, res: Response) => {
    const { login, email, password } = req.body;
    const newUser = await AuthService.registerUser({ login, email, password });
    console.log(process.env.EMAIL_LOGIN);
    console.log(process.env.EMAIL_PASSWORD);
    if (!newUser) {
      res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
      return;
    }
    res.status(HTTP_RESPONSE_CODES.NO_CONTENT).send("OK!");
  }
);

authRouter.post(
  "/registration-confirmation",
  requestQuantityFixer,
  registerCodeConfirmation(),
  async (req: RequestWithBody<EmailConfirmationCode>, res: Response) => {
    const result = await AuthService.confirmEmail(req.body.code);

    if (!result) {
      res.sendStatus(400);
      return;
    }
    res.status(204).send("OK!");
  }
);

authRouter.post(
  "/registration-email-resending",
  requestQuantityFixer,
  resendEmailValidator(),
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const confirmEmailResult = await AuthService.resendConfirmEmail(
      req.body.email
    );

    if (!confirmEmailResult) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(204);
  }
);

authRouter.post(
  "/login",
  requestQuantityFixer,
  loginOrEmailValidation(),
  async (req: RequestWithBody<LoginInputType>, res: Response) => {
    const clientDeviceData: DeviceInfoType = {
      ip: req.ip!,
      title: req.headers["user-agent"] || "Unknown Device",
    };
    const loginResult = await AuthService.login(req.body, clientDeviceData);

    if (!loginResult) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    const { refreshToken, accessToken } = loginResult;

    if (!loginResult) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .status(HTTP_RESPONSE_CODES.SUCCESS)
      .send({ accessToken });
  }
);

authRouter.post(
  "/refresh-token",
  jwtRefreshTokenGuard,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.cookies.refreshToken;

    const refreshResult = await AuthService.refreshToken(token, userId!);

    if (!refreshResult) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    const { refreshToken, accessToken } = refreshResult;

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .send({ accessToken })
      .status(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
authRouter.get("/me", jwtAccessGuard, async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return null;
  const user = await UserQueryRepository.getUserById(userId);
  if (!user) return null;
  const { email, login } = user;
  res.status(HTTP_RESPONSE_CODES.SUCCESS).send({ email, login, userId });
  return;
});

authRouter.post(
  "/logout",
  jwtRefreshTokenGuard,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    const deviceParams = await JwtService.getParamsFromRefreshToken(
      refreshToken
    );

    if (!deviceParams) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    await SessionService.deleteSession(deviceParams.deviceInfo.deviceId);

    const logoutResult = await AuthRepository.expireToken(refreshToken);

    if (!logoutResult) {
      res.sendStatus(HTTP_RESPONSE_CODES.UNAUTHORIZED);
      return;
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);

//  ******* Password recovery ***** //
//
// POST - api/auth/password-recovery
// POST - api/auth/new-password

authRouter.post(
  "/password-recovery",
  requestQuantityFixer,
  emailValidation(),
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const email = req.body.email;
    const isExist = await UserQueryRepository.getUserByLoginOrEmail(email);
    if (!isExist) {
      res
        .status(204)
        .send(
          "Oops! It seems like the email address provided doesn't match any account in our system. Please verify and try again."
        );
    }

    const sendRecoveryCode = await AuthService.sendPasswordRecoveryCode(email);
    if (!sendRecoveryCode) {
      res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
    }

    res
      .status(HTTP_RESPONSE_CODES.NO_CONTENT)
      .send("Recovery code sent successfully");
  }
);

authRouter.post(
  "/new-password",
  newPasswordValidation(),
  async (
    req: RequestWithBody<{ recoveryCode: string; newPassword: string }>,
    res: Response
  ) => {
    const recoveryCode = req.body.recoveryCode;
    const newPassword = req.body.newPassword;

    const isCodeValid = await JwtService.checkRecoveryCode(recoveryCode);

    if (!isCodeValid) {
      res.status(400).send("Recovery code is not valid!");
      return;
    }

    const setNewPassword = await AuthService.setNewPassword(
      recoveryCode,
      newPassword
    );

    if (!setNewPassword) {
      res.sendStatus(400);
      return;
    }

    res.status(204).send("Password updated!");
  }
);
