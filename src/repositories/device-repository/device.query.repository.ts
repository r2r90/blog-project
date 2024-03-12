import { DeviceOutputModel } from "../../models/device/device.output.model";
import { deviceConnectCollection } from "../../db/db";
import { deviceMapper } from "../../models/device/device-mapper";

export class DeviceQueryRepository {
  static async findSessionDevice(
    deviceId: string
  ): Promise<DeviceOutputModel | null> {
    const foundedDevice = await deviceConnectCollection.findOne({
      deviceId: deviceId,
    });

    if (!foundedDevice) return null;

    return foundedDevice ? deviceMapper(foundedDevice) : null;
  }
}
