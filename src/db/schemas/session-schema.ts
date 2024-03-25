import mongoose from "mongoose";
import { WithId } from "mongodb";

export type SessionDbType = {
  userId: string;
  deviceId: string;
  title: string;
  ip: string;
  lastActiveDate: string;
};

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  title: { type: String, required: true },
  ip: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
});

export const SessionDbModel = mongoose.model<WithId<SessionDbType>>(
  "sessions",
  SessionSchema
);
