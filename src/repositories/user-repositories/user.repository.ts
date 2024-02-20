import { usersCollection } from "../../db/db";
import { UserDbType } from "../../types/db-types";
import { ObjectId } from "mongodb";
import e from "express";

export class UserRepository {
  static async createUser(user: UserDbType) {
    const {
      createdAt,
      login,
      email,
      passwordSalt,
      passwordHash,
      registerCode,
      isConfirmed,
    } = user;

    const isUserExist = await this.doesExistByLoginOrEmail(login, email);

    if (isUserExist) return null;

    const createdUser = await usersCollection.insertOne({
      createdAt,
      login,
      email,
      passwordHash,
      passwordSalt,
      isConfirmed,
      registerCode,
    });

    return createdUser.insertedId.toString();
  }

  static async deleteUser(id: string) {
    const res = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }

  static async doesExistByLoginOrEmail(login: string, email: string) {
    // Check if User already is existing in DB
    return await usersCollection.findOne({
      $or: [{ login }, { email }],
    });
  }
}
