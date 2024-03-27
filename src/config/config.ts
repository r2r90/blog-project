import { config } from "dotenv";

config();
export const appConfig = {
  PORT: process.env.PORT,

  MONGO_URL: process.env.MONGO_URL,
  JWT_ACCESS_SECRET: process.env.JWT_SECRET || "123",
  JWT_REFRESH_SECRET: process.env.JWT_SECRET || "456",
  JWT_ACCESS_EXPIRES_TIME: "10s",
  JWT_REFRESH_SECRET_EXPIRES_TIME: "20s",
  EMAIL_LOGIN: process.env.EMAIL_LOGIN,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_RECOVERY_SECRET: process.env.JWT_RECOVERY_PASSWORD_SECRET || "789",
  EMAIL_RECOVERY_EXPIRES_TIME: "1h",
};
