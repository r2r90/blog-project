import { DeviceOutputModel } from "../../types/device/device.output.model";
import { deviceMapper } from "../../types/device/device-mapper";
import { SessionDbModel } from "../../db/schemas/session-schema";

export class SessionQueryRepository {
  static async findSessionDevice(
    deviceId: string
  ): Promise<DeviceOutputModel | null> {
    const foundedDevice = await SessionDbModel.findOne({
      deviceId: deviceId,
    });

    if (!foundedDevice) return null;

    return foundedDevice ? deviceMapper(foundedDevice) : null;
  }

  static async getDeviceByUser(deviceId: string, userId: string) {
    return SessionDbModel.findOne({ deviceId, userId });
  }
}
