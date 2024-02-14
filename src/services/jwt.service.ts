import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";

export class jwtService {
  static async createJWT(userId: string): Promise<string> {
    return jwt.sign({ userId: userId }, appConfig.JWT_SECRET, {
      expiresIn: appConfig.JWT_EXPIRES_TIME,
    });
  }
}
