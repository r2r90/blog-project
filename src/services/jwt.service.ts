import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { JwtVerifyType } from "../types/common/common";

export class jwtService {
  static async createJWT(
    userId: string,
    expiresTime: string,
    secret: string
  ): Promise<string> {
    return jwt.sign({ userId: userId }, secret, {
      expiresIn: expiresTime,
    });
  }

  static async getUserIdByAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, appConfig.JWT_ACCESS_SECRET);
      let { userId, iat, exp } = payload as JwtVerifyType;
      return userId;
    } catch (e) {
      return null;
    }
  }
}
