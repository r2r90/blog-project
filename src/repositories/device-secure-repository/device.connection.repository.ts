import { deviceSecurityCollection } from "../../db/db";

export class DeviceConnectionRepository {
  static async deviceConnectionFixing(ip: string, url: string) {
    return await deviceSecurityCollection.insertOne({
      IP: ip,
      URL: url,
      date: new Date(),
    });
  }

  static async deviceConnectionCounter(ip: string, url: string) {
    // Get current date
    const currentDate = new Date();
    // Calculate the date before 10 seconds
    const limitDate = new Date(currentDate.getTime() - 10 * 1000);

    const query = {
      IP: ip,
      URL: url,
      date: { $gte: limitDate },
    };

    return await deviceSecurityCollection.countDocuments(query);
  }
}
