import { DeviceRepository } from "../repositories/device-repository/device.repository";
import { deviceConnectCollection } from "../db/db";

export class DeviceService {
  static async deleteDevice(deviceId: string) {
    const findDeviceToDelete = await deviceConnectCollection.findOne({
      deviceId,
    });

    if (!findDeviceToDelete) return null;

    return await DeviceRepository.deleteDeviceById(deviceId);
  }

  static async deleteAllDevices(userId: string) {
    return await DeviceRepository.deleteAllDevicesByUserId(userId);
  }

  static async checkDeviceOwner(deviceId: string, userId: string) {
    const findDevice = await deviceConnectCollection.findOne({
      deviceId,
    });

    return findDevice!.deviceId === userId;
  }
}
