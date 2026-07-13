import { signToken } from "../../lib/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { comparePassword, hashPassword } from "../../lib/bcrypt.js";
import { authRepository } from "./auth.repository.js";

class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const registerUserData = {
      ...data,
      password: hashedPassword,
    };

    const user = await authRepository.create(registerUserData);

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const { password, ...userObject } = user.toObject();

    return {
      user: userObject,
      token,
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const { password, ...userObject } = user.toObject();

    return {
      user: userObject,
      token,
    };
  }

  async adminLogin(data: LoginInput) {
    const user = await authRepository.findAdminByEmail(data.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;

    return {
      user: safeUser,
      token,
    };
  }
}

export const authService = new AuthService();
