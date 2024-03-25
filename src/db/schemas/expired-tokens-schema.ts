import mongoose from "mongoose";
import { RefreshTokenDbType } from "../../types/db-types";

const ExpiredTokensSchema = new mongoose.Schema<RefreshTokenDbType>({
  refreshToken: { type: String, required: true },
});

export const ExpiredTokensModel = mongoose.model(
  "expired-tokens",
  ExpiredTokensSchema
);
