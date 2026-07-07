import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { JwtPayload } from "jsonwebtoken";
import type { UserRole } from "../models/user.model.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

interface SignTokenPayload {
  id: string;
  role: UserRole;
}

export const signToken = (payload: SignTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & SignTokenPayload;
};
