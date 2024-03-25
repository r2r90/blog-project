import { ExpiredTokensModel } from "../../db/schemas/expired-tokens-schema";

export class AuthRepository {
  static async expireToken(refreshToken: string) {
    return await ExpiredTokensModel.create({ refreshToken });
  }

  static async findTokenInExpiredList(refreshToken: string) {
    try {
      return await ExpiredTokensModel.findOne({ refreshToken });
    } catch (error) {
      console.error("Error finding token in expired list:", error);
      throw error;
    }
  }
}
