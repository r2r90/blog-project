import { ObjectId } from "mongodb";
import { add } from "date-fns";
import { UserDbType, UsersModel } from "../../db/schemas/users-schema";
import { UserQueryRepository } from "./user.query.repository";

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
    let result = await UsersModel.updateOne(
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
      return !!user;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }

  static async setUserRecoveryCode(email: string, recoveryCode: string) {
    try {
      const user = await UserQueryRepository.getUserByLoginOrEmail(email);
      if (!user) return null;

      const result = await UsersModel.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { recoveryCode: recoveryCode } }
      );

      return !!result.modifiedCount;
    } catch (error) {
      console.error("Error setting user recovery code:", error);
      throw error;
    }
  }

  static async setNewPassword(userId: string, newPasswordHash: string) {
    let result = await UsersModel.updateOne(
      { _id: new ObjectId(userId).toString() },
      { $set: { recoveryCode: null, passwordHash: newPasswordHash } }
    );
    return !!result.modifiedCount;
  }
}
