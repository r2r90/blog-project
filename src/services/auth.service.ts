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

    const token = {
      accessToken: "",
    };

    token.accessToken = await jwtService.createJWT(user._id.toString());
    return token;
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

    const registerCode = randomUUID();

    const user: UserDbType = {
      createdAt: new Date().toISOString(),
      login,
      email,
      passwordHash,
      passwordSalt,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };

    const createdUserId = await UserRepository.createUser(user);

    if (!createdUserId) return null;

    await EmailService.confirmEmailSend(email, registerCode);
    return {
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
      id: createdUserId,
    };
  }

  static async confirmEmail(code: string): Promise<boolean> {
    let user = await UserQueryRepository.getUserByConfirmationCode(code);
    if (!user) return false;

    if (user.emailConfirmation?.confirmationCode !== code) return false;
    if (user.emailConfirmation?.expirationDate < new Date()) return false;

    return await UserRepository.updateUserConfirmation(user._id);
  }

  static async _validatePassword(password: string, salt: string, hash: string) {
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash === hash;
  }
}
