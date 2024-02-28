import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { LoginInputType } from "../types/auth/login.input";
import bcrypt from "bcrypt";
import { jwtService } from "./jwt.service";
import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { UserViewModel } from "../types/users/users-output/user.output.model";
import { BcryptService } from "./bcrypt-service";
import { randomUUID } from "crypto";
import { UserDbType } from "../types/db-types";
import { UserRepository } from "../repositories/user-repositories/user.repository";
import { EmailService } from "./email.service";
import { add } from "date-fns";
import { appConfig } from "../config/config";
import { AuthRepository } from "../repositories/auth-repositories/auth.repository";

export class AuthService {
  static async login(credentials: LoginInputType) {
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

    const accessToken = await jwtService.createJWT(
      user._id.toString(),
      appConfig.JWT_ACCESS_EXPIRES_TIME,
      appConfig.JWT_ACCESS_SECRET
    );

    const refreshToken = await jwtService.createJWT(
      user._id.toString(),
      appConfig.JWT_REFRESH_SECRET_EXPIRES_TIME,
      appConfig.JWT_REFRESH_SECRET
    );

    return {
      accessToken,
      refreshToken,
    };
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

  /*static async refreshToken(refreshToken: string) {
    try {
      const isExistInBlackList = await AuthRepository.findTokenInBlackList(
        refreshToken
      );

      if (isExistInBlackList) return null;



      const accessToken = await jwtService.createJWT();
    } catch (e) {
      console.log(e);
    }
  }*/

  static async _validatePassword(password: string, salt: string, hash: string) {
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash === hash;
  }
}
