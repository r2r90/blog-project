import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { LoginInputType } from "../models/auth/input";
import bcrypt from "bcrypt";

export class AuthService {
  static async login(credentials: LoginInputType) {
    const user = await UserQueryRepository.getUserByLoginOrEmail(
      credentials.loginOrEmail
    );

    if (!user) return null;

    return await this._validatePassword(
      credentials.password,
      user.passwordSalt,
      user.passwordHash
    );
  }

  static async _validatePassword(password: string, salt: string, hash: string) {
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash === hash;
  }
}
