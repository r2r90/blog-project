import mongoose from "mongoose";

export type UserDbType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  recoveryCode: string | null;
};

const UsersSchema = new mongoose.Schema<UserDbType>({
  login: { type: String, minLength: 3, maxlength: 10, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, default: null },
    expirationDate: { type: Date },
    isConfirmed: { type: Boolean, default: false },
  },
  recoveryCode: { type: String, default: null },
});

export const UsersModel = mongoose.model("users", UsersSchema);
