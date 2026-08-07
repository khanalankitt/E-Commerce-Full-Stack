import userRepository from "./user.repository.js";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "./user.validation.js";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "./user.validation.js";
import { comparePassword, hashPassword } from "../../lib/bcrypt.js";

class UserService {
  async getAccount(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const data = updateProfileSchema.parse(input);

    if (data.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing._id.toString() !== userId) {
        const error: any = new Error("Email already in use");
        error.statusCode = 409;
        throw error;
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    const user = await userRepository.updateById(userId, updateData);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const data = changePasswordSchema.parse(input);

    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await comparePassword(data.currentPassword, user.password);
    if (!isMatch) {
      const error: any = new Error("Current password is incorrect");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await userRepository.updatePassword(userId, hashedPassword);

    return user;
  }
}

export default new UserService();
