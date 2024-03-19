import { DeviceRepository } from "../repositories/device-repository/device.repository";

export class DeviceService {
  static async deleteDevice(deviceId: string) {
    const foundDeviceToDelete = await DeviceRepository.deleteDeviceById(
      deviceId
    );

    if (!foundDeviceToDelete) return null;

    return await DeviceRepository.deleteDeviceById(deviceId);
  }
}
