import { WithId } from "mongodb";
import { DeviceConnectDbType } from "../db-types";
import { DeviceOutputModel } from "./device.output.model";

export const deviceMapper = (
  device: WithId<DeviceConnectDbType>
): DeviceOutputModel => {
  return {
    ip: device.ip,
    title: device.deviceName,
    lastActiveDate: device.lastActiveDate,
    deviceId: device.deviceId,
  };
};
