import { config } from "dotenv";

config();
export const appConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET || "123",
  JWT_EXPIRES_TIME: "3h",
};
