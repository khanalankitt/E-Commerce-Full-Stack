import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { User } from "../models/user.model.js";
import { UserRole } from "../models/user.model.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
