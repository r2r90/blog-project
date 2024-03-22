import { usersCollection } from "../../db/db";
import { UserDbType } from "../../models/db-types";
import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { UsersModel } from "../../db/schemas/users-schema";

export class UserRepository {
  static async createUser(user: UserDbType) {
    const { createdAt, login, email, passwordSalt, passwordHash } = user;

    const isUserExist = await this.doesExistByLoginOrEmail(login, email);

    if (isUserExist) return null;

    const createdUser = await UsersModel.create({
      createdAt,
      login,
      email,
      passwordHash,
      passwordSalt,
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation?.expirationDate,
        isConfirmed: user.emailConfirmation.isConfirmed,
      },
    });

    return createdUser.id;
  }

  static async updateUserConfirmCodeAndExpDate(
    id: ObjectId,
    newConfirmCode: string
  ): Promise<boolean> {
    let result = await UsersModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "emailConfirmation.expirationDate": add(new Date(), {
            hours: 1,
            minutes: 3,
          }),
          "emailConfirmation.confirmationCode": newConfirmCode,
        },
      }
    );
    return !!result.modifiedCount;
  }

  static async updateUserConfirmation(id: ObjectId): Promise<boolean> {
    let result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return !!result.modifiedCount;
  }

  static async deleteUser(id: string) {
    const res = await UsersModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }

  static async doesExistByLoginOrEmail(login?: string, email?: string) {
    try {
      const user = await UsersModel.findOne({
        $or: [{ login }, { email }],
      });
      return !!user; // If user exists, returns true, otherwise false
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error; // Rethrow the error to be handled elsewhere
    }
  }
}
