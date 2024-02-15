import { usersCollection } from "../../db/db";
import { UserDbType } from "../../types/db-types";
import { ObjectId } from "mongodb";

export class UserRepository {
  static async createUser(user: UserDbType) {
    const { createdAt, login, email, passwordSalt, passwordHash } = user;

    // Check if User already is existing in DB
    /*    const existingUser = await usersCollection.findOne({
      $or: [{ login }, { email }],
    });
    if (existingUser) return null;*/

    const createdUser = await usersCollection.insertOne({
      createdAt,
      login,
      email,
      passwordHash,
      passwordSalt,
    });

    return createdUser.insertedId.toString();
  }

  static async deleteUser(id: string) {
    const res = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
