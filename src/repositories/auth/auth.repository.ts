import { blackListCollection } from "../../db/db";

export class AuthRepository {
  static async AddRefreshToken(refreshToken: string) {
    return await blackListCollection.insertOne({ refreshToken });
  }
}
