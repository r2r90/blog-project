import { deviceSecurityCollection } from "../../db/db";

export class DeviceConnectionRepository {
  static async DeviceConnectionFixing(ip: string, url: string) {
    return await deviceSecurityCollection.insertOne({
      IP: ip,
      URL: url,
      date: new Date(),
    });
  }
}
