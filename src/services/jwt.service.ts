import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { ObjectId } from "mongodb";
import { JwtVerifyType } from "../types/common/common";

export class jwtService {
  static async createJWT(userId: string): Promise<string> {
    return jwt.sign({ userId: userId }, appConfig.JWT_SECRET, {
      expiresIn: appConfig.JWT_EXPIRES_TIME,
    });
  }

  static async getUserIdByToken(token: string) {
    try {
      const payload = jwt.verify(token, appConfig.JWT_SECRET);
      let { userId, iat, exp } = payload as JwtVerifyType;
      return userId;
    } catch (e) {
      return null;
    }
  }
}
