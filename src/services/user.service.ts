import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { UserViewModel } from "../types/users/users-output/user.output.model";
import { UserDbType } from "../types/db-types";
import { UserRepository } from "../repositories/user-repositories/user.repository";
import { BcryptService } from "./bcrypt-service";
import { add } from "date-fns";
import { randomUUID } from "crypto";

export class UserService {
  static async createUser(
    newUserCreateData: UserCreateInputType
  ): Promise<UserViewModel | null> {
    const { login, email, password } = newUserCreateData;

    if (!login || !password || !email) return null;

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
        isConfirmed: true,
      },
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
