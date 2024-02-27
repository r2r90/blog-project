import { usersCollection } from "../../db/db";
import { UserDbType } from "../../types/db-types";
import { ObjectId } from "mongodb";
import { add } from "date-fns";

export class UserRepository {
  static async createUser(user: UserDbType) {
    const { createdAt, login, email, passwordSalt, passwordHash } = user;

    const isUserExist = await this.doesExistByLoginOrEmail(login, email);

    if (isUserExist) return null;

    const createdUser = await usersCollection.insertOne({
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

    return createdUser.insertedId.toString();
  }

  /*  confirmationCode: registerUUIDCode,
    expirationDate: add(new Date(), {
    hours: 1,
    minutes: 3,
  }),*/

  static async updateUserConfirmCodeAndExpDate(
    id: ObjectId,
    newConfirmCode: string
  ): Promise<boolean> {
    let result = await usersCollection.updateOne(
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
    console.log(result);
    return !!result.modifiedCount;
  }

  static async deleteUser(id: string) {
    const res = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }

  static async doesExistByLoginOrEmail(login?: string, email?: string) {
    // Check if User already is existing in DB
    return await usersCollection.findOne({
      $or: [{ login }, { email }],
    });
  }
}
