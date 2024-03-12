import { deviceConnectCollection, deviceRequestsCollection } from "../../db/db";
import { DeviceConnectDbType } from "../../models/db-types";
import { deviceMapper } from "../../models/device/device-mapper";

export class DeviceRepository {
  static async requestFromDeviceFixing(ip: string, url: string) {
    return await deviceRequestsCollection.insertOne({
      IP: ip,
      URL: url,
      date: new Date(),
    });
  }

  static async deviceRequestCounter(ip: string, url: string) {
    // Get current date
    const currentDate = new Date();
    // Calculate the date before 10 seconds
    const limitDate = new Date(currentDate.getTime() - 10 * 1000);

    const query = {
      IP: ip,
      URL: url,
      date: { $gte: limitDate },
    };

    return await deviceRequestsCollection.countDocuments(query);
  }

  static async saveDeviceSession(sessionData: DeviceConnectDbType) {
    await deviceConnectCollection.insertOne(sessionData);
    return true;
  }

  static async updateDeviceSession(sessionData: DeviceConnectDbType) {
    const res = await deviceConnectCollection.updateOne(
      { deviceId: sessionData.deviceId },
      {
        $set: {},
      }
    );

    return !!res.matchedCount;
  }

  static async getAllDevices() {
    const devices = await deviceConnectCollection.find({}).toArray();
    const outputModel = devices.map(deviceMapper);
    return outputModel;
  }
}
