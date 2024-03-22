import mongoose from "mongoose";
import { UserDbType } from "../../models/db-types";

const UsersSchema = new mongoose.Schema<UserDbType>({
  login: { type: String, minLength: 3, maxlength: 10, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

export const UsersModel = mongoose.model("users", UsersSchema);
