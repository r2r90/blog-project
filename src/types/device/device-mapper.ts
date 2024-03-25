import { WithId } from "mongodb";
import { DeviceOutputModel } from "./device.output.model";
import { SessionDbType } from "../../db/schemas/session-schema";

export const deviceMapper = (
  device: WithId<SessionDbType>
): DeviceOutputModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.lastActiveDate,
    deviceId: device.deviceId,
  };
};
