import { JwtService } from "./jwt-service";
import { appConfig } from "../config/config";
import { DeviceConnectDbType } from "../models/db-types";
import { randomUUID } from "crypto";
import { DeviceInfoType } from "../models/auth/login.input";
import { DeviceRepository } from "../repositories/device-repository/device.repository";

export class DeviceService {
  static async addDeviceToList(
    clientDeviceData: DeviceInfoType,
    refreshToken: string
  ) {
    const refreshTokenPayload = await JwtService.checkTokenValidation(
      refreshToken,
      appConfig.JWT_REFRESH_SECRET
    );

    const timeStamp = refreshTokenPayload?.exp;
    const expDate = timeStamp ? new Date(timeStamp * 1000) : null;

    const sessionData: DeviceConnectDbType = {
      userId: clientDeviceData.userId,
      lastActiveDate: expDate!.toISOString(),
      ip: clientDeviceData.ip,
      deviceId: randomUUID(),
      deviceName: clientDeviceData.title || "Unknown device",
    };

    const sessionIsDone = await DeviceRepository.saveDeviceSession(sessionData);
    if (!sessionIsDone) return null;
    return true;
  }
}
