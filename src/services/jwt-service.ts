import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { JwtVerifyType } from "../types/common";

type ExtraData = {
  deviceId?: string;
  title?: string;
  ip?: string;
  lastActiveDate?: string;
};

export class JwtService {
  static async createAccessToken(
    userId: string,
    expiresTime: string,
    secret: string
  ): Promise<string> {
    return jwt.sign({ userId: userId }, secret, {
      expiresIn: expiresTime,
    });
  }

  static async createRefreshToken(
    userId: string,
    expiresTime: string,
    secret: string,
    deviceInfo: ExtraData
  ): Promise<string> {
    const payload = {
      userId,
      deviceInfo,
      deviceId: deviceInfo.deviceId,
    };

    return jwt.sign(payload, secret, {
      expiresIn: expiresTime,
    });
  }

  static async createRecoveryCode(email: string) {
    return jwt.sign({ email }, appConfig.EMAIL_RECOVERY_SECRET, {
      expiresIn: appConfig.EMAIL_RECOVERY_EXPIRES_TIME,
    });
  }

  static async getUserIdByAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, appConfig.JWT_ACCESS_SECRET);
      let { userId } = payload as JwtVerifyType;
      return userId;
    } catch (e) {
      return null;
    }
  }

  static async getParamsFromRefreshToken(token: string) {
    try {
      const payload = jwt.verify(token, appConfig.JWT_REFRESH_SECRET);
      let { userId, iat, exp, deviceInfo } = payload as JwtVerifyType;
      return { userId, iat, exp, deviceInfo };
    } catch (e) {
      return null;
    }
  }

  static async checkTokenValidation(token: string, secret: string) {
    try {
      const payload = jwt.verify(token, secret);
      let { userId, iat, exp, deviceInfo } = payload as JwtVerifyType;

      return { userId, iat, exp, deviceInfo };
    } catch (e) {
      return null;
    }
  }
}
