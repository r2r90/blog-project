import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { ObjectId } from "mongodb";

export class jwtService {
  static async createJWT(userId: string): Promise<string> {
    return jwt.sign({ userId: userId }, appConfig.JWT_SECRET, {
      expiresIn: appConfig.JWT_EXPIRES_TIME,
    });
  }

  static async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, appConfig.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (e) {
      return null;
    }
  }
}
