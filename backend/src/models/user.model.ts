import { Schema, model } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
