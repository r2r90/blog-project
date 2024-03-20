import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { DeviceInfoType, LoginInputType } from "../models/auth/login.input";
import bcrypt from "bcrypt";
import { JwtService } from "./jwt-service";
import { UserCreateInputType } from "../models/users/users-input/user.input.model";
import { UserViewModel } from "../models/users/users-output/user.output.model";
import { BcryptService } from "./bcrypt-service";
import { randomUUID } from "crypto";
import { DeviceConnectDbType, UserDbType } from "../models/db-types";
import { UserRepository } from "../repositories/user-repositories/user.repository";
import { EmailService } from "./email-service";
import { add } from "date-fns";
import { appConfig } from "../config/config";
import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { AuthRepository } from "../repositories/auth-repositories/auth.repository";
import { DeviceService } from "./device-service";

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

    const sessionData: DeviceConnectDbType = {
      userId,
      deviceId: randomUUID(),
      title: clientDeviceData.title,
      ip: clientDeviceData.ip,
      lastActiveDate: new Date().toISOString(),
    };

    await DeviceRepository.saveDeviceSession(sessionData);

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
    await AuthRepository.addRefreshTokenToBlackList(actualToken);

    const accessToken = await JwtService.createAccessToken(
      userId!,
      appConfig.JWT_ACCESS_EXPIRES_TIME,
      appConfig.JWT_ACCESS_SECRET
    );

    const jwtPayload = await JwtService.checkTokenValidation(
      actualToken,
      appConfig.JWT_REFRESH_SECRET
    );

    console.log(jwtPayload);

    if (!jwtPayload) return null;

    await DeviceService.updateLastActiveDate(
      jwtPayload?.deviceInfo.deviceId,
      userId
    );

    const refreshToken = await JwtService.createRefreshToken(
      userId!,
      appConfig.JWT_REFRESH_SECRET_EXPIRES_TIME,
      appConfig.JWT_REFRESH_SECRET,
      jwtPayload.deviceInfo
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
