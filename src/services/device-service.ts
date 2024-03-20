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

  static async deleteAllDevices(userId: string, deviceId: string) {
    return await DeviceRepository.deleteAllDevicesByUserId(userId, deviceId);
  }

  static async getDeviceById(deviceId: string) {
    return await deviceConnectCollection.findOne({
      deviceId,
    });
  }

  static async updateLastActiveDate(deviceId: string, userId: string) {
    await DeviceRepository.updateLastActiveDate(deviceId, userId);
  }
}
