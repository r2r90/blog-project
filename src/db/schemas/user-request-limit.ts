import mongoose from "mongoose";
import { WithId } from "mongodb";

export type RequestGuardDataType = {
  IP: string;
  URL: string;
  date: Date;
};

const RequestGuardSchema = new mongoose.Schema({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: Date,
});

export const RequestGuardModel = mongoose.model<WithId<RequestGuardDataType>>(
  "request-guard",
  RequestGuardSchema
);
