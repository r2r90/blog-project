import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { DeviceInfoType, LoginInputType } from "../types/auth/login.input";
import bcrypt from "bcrypt";
import { JwtService } from "./jwt-service";
import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { UserViewModel } from "../types/users/users-output/user.output.model";
import { BcryptService } from "./bcrypt-service";
import { randomUUID } from "crypto";
import { UserDbType } from "../types/db-types";
import { UserRepository } from "../repositories/user-repositories/user.repository";
import { EmailService } from "./email-service";
import { add } from "date-fns";
import { appConfig } from "../config/config";
import { SessionRepository } from "../repositories/session-repository/session.repository";
import { AuthRepository } from "../repositories/auth-repositories/auth.repository";
import { SessionService } from "./session-service";
import { SessionQueryRepository } from "../repositories/session-repository/session.query.repository";
import { SessionDbType } from "../db/schemas/session-schema";

export class AuthService {
  static async login(
    credentials: LoginInputType,
    clientDeviceData: DeviceInfoType
  ) {
    const user = await UserQueryRepository.getUserByLoginOrEmail(
      credentials.loginOrEmail
    );

    if (!user) return null;

    const passwordValidation = await this._validatePassword(
      credentials.password,
      user.passwordSalt,
      user.passwordHash
    );

    if (!passwordValidation) return null;

    const accessToken = await JwtService.createAccessToken(
      user._id.toString(),
      appConfig.JWT_ACCESS_EXPIRES_TIME,
      appConfig.JWT_ACCESS_SECRET
    );

    const userId = await JwtService.getUserIdByAccessToken(accessToken);

    if (!userId) return null;

    const sessionData: SessionDbType = {
      userId,
      deviceId: randomUUID(),
      title: clientDeviceData.title,
      ip: clientDeviceData.ip,
      lastActiveDate: new Date().toISOString(),
    };

    await SessionRepository.saveDeviceSession(sessionData);

    const refreshToken = await JwtService.createRefreshToken(
      user._id.toString(),
      appConfig.JWT_REFRESH_SECRET_EXPIRES_TIME,
      appConfig.JWT_REFRESH_SECRET,
      sessionData
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(actualToken: string, userId: string) {
    await AuthRepository.expireToken(actualToken);

    const jwtPayload = await JwtService.checkTokenValidation(
      actualToken,
      appConfig.JWT_REFRESH_SECRET
    );

    if (!jwtPayload) return null;

    const sessionVerification = await SessionQueryRepository.findSessionDevice(
      jwtPayload.deviceInfo.deviceId
    );

    if (!sessionVerification) return null;

    const accessToken = await JwtService.createAccessToken(
      userId!,
      appConfig.JWT_ACCESS_EXPIRES_TIME,
      appConfig.JWT_ACCESS_SECRET
    );

    const refreshToken = await JwtService.createRefreshToken(
      userId!,
      appConfig.JWT_REFRESH_SECRET_EXPIRES_TIME,
      appConfig.JWT_REFRESH_SECRET,
      jwtPayload.deviceInfo
    );

    await SessionService.updateLastActiveDate(
      jwtPayload?.deviceInfo.deviceId,
      userId
    );

    return { refreshToken, accessToken };
  }

  static async registerUser({
    login,
    email,
    password,
  }: UserCreateInputType): Promise<UserViewModel | null> {
    const passwordSalt = await BcryptService.generateSalt();
    const passwordHash = await BcryptService.generateHash(
      passwordSalt,
      password
    );

    const registerUUIDCode = randomUUID();

    const user: UserDbType = {
      createdAt: new Date().toISOString(),
      login,
      email,
      passwordHash,
      passwordSalt,
      emailConfirmation: {
        confirmationCode: registerUUIDCode,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };

    const createdUserId = await UserRepository.createUser(user);

    if (!createdUserId) return null;

    await EmailService.confirmEmailSend(email, registerUUIDCode);
    return {
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
      id: createdUserId,
    };
  }

  static async resendConfirmEmail(email: string): Promise<boolean> {
    const user = await UserQueryRepository.getUserByLoginOrEmail(email);
    if (!user || user.emailConfirmation?.isConfirmed) return false;
    const newConfirmCode = randomUUID();
    await UserRepository.updateUserConfirmCodeAndExpDate(
      user._id,
      newConfirmCode
    );
    await EmailService.confirmEmailSend(email, newConfirmCode);
    return true;
  }

  static async confirmEmail(code: string): Promise<boolean> {
    let user = await UserQueryRepository.getUserByConfirmationCode(code);

    if (!user) return false;
    return await UserRepository.updateUserConfirmation(user._id);
  }

  static async _validatePassword(password: string, salt: string, hash: string) {
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash === hash;
  }
}
