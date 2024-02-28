import { blackListCollection } from "../../db/db";

export class AuthRepository {
  static async addRefreshTokenToBlackList(refreshToken: string) {
    return await blackListCollection.insertOne({ refreshToken });
  }

  static async findTokenInBlackList(refreshToken: string) {
    return await blackListCollection.findOne({ refreshToken });
  }
}
