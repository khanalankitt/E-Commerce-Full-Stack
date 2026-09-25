import type { NextFunction, Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  getAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getAccount(req.user._id.toString());
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.updateProfile(
        req.user._id.toString(),
        req.body,
      );
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.changePassword(req.user._id.toString(), req.body);
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
