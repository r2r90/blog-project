import { deviceMapper } from "../../types/device/device-mapper";
import { SessionDbModel, SessionDbType } from "../../db/schemas/session-schema";
import { RequestGuardModel } from "../../db/schemas/user-request-limit";

export class SessionRepository {
  static async requestFromDeviceFixing(ip: string, url: string) {
    return await RequestGuardModel.create({
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

    return RequestGuardModel.countDocuments(query);
  }

  static async saveDeviceSession(sessionData: SessionDbType) {
    await SessionDbModel.create(sessionData);
    return true;
  }

  static async getAllSessions(userId: string) {
    const devices = await SessionDbModel.find({ userId });
    return devices.map(deviceMapper);
  }

  static async updateLastActiveDate(deviceId: string, userId: string) {
    const res = await SessionDbModel.updateOne(
      { deviceId },
      { $set: { lastActiveDate: new Date().toISOString() } }
    );

    return !!res.matchedCount;
  }

  static async deleteSessionById(deviceId: string) {
    const result = await SessionDbModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  }

  static async deleteAllDevicesByUserId(
    userId: string,
    currentDeviceId: string
  ) {
    const result = await SessionDbModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });

    return result.deletedCount;
  }
}
