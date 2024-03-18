import { JwtService } from "./jwt-service";
import { appConfig } from "../config/config";
import { DeviceConnectDbType } from "../models/db-types";
import { randomUUID } from "crypto";
import { DeviceInfoType } from "../models/auth/login.input";
import { DeviceRepository } from "../repositories/device-repository/device.repository";

export class DeviceService {
  static async addDeviceToList(clientDeviceData: DeviceInfoType) {
    console.log(clientDeviceData);
  }
}
