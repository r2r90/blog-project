import { blackListCollection } from "../../db/db";

export class AuthRepository {
  static async addRefreshToken(refreshToken: string) {
    return await blackListCollection.insertOne({ refreshToken });
  }

  static async findTokenInBlackList(refreshToken: string) {
    return await blackListCollection.findOne({ refreshToken });
  }
}
