import { SessionRepository } from "../repositories/session-repository/session.repository";
import { SessionDbModel } from "../db/schemas/session-schema";

export class SessionService {
  static async deleteSession(deviceId: string) {
    const findDeviceToDelete = await SessionDbModel.findOne({
      deviceId,
    });

    if (!findDeviceToDelete) return null;

    return await SessionRepository.deleteSessionById(deviceId);
  }

  static async deleteAllSessions(userId: string, deviceId: string) {
    return await SessionRepository.deleteAllDevicesByUserId(userId, deviceId);
  }

  static async getSessionById(deviceId: string) {
    return SessionDbModel.findOne({
      deviceId,
    });
  }

  static async updateLastActiveDate(deviceId: string, userId: string) {
    await SessionRepository.updateLastActiveDate(deviceId, userId);
  }
}
