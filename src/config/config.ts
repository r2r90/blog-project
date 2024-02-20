import { config } from "dotenv";

config();
export const appConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  JWT_SECRET: process.env.JWT_SECRET || "123",
  JWT_EXPIRES_TIME: "3h",
  EMAIL_LOGIN: process.env.EMAIL_LOGIN,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
