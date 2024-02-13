import { UserCreateInputType } from "../models/users/users-input/user.input.model";
import { UserOutputType } from "../models/users/users-output/user.output.model";
import bcrypt from "bcrypt";
import { UserDbType } from "../models/db-types";
import { UserRepository } from "../repositories/user-repositories/user.repository";

export class UserService {
  static async createUser(
    newUserCreateData: UserCreateInputType
  ): Promise<UserOutputType | null> {
    const { login, email, password } = newUserCreateData;

    if (!login || !password || !email) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const user: UserDbType = {
      createdAt: new Date().toISOString(),
      login,
      email,
      passwordHash,
      passwordSalt,
    };

    const createdUserId = await UserRepository.createUser(user);

    if (!createdUserId) return null;

    return {
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
      id: createdUserId,
    };
  }

  static async deleteUser(id: string): Promise<boolean | null> {
    return await UserRepository.deleteUser(id);
  }
}
