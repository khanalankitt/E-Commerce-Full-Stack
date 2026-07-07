import { User } from "../../models/user.model.js";

class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({ email }).select("+password");
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(data: { name: string; email: string; password: string }) {
    return User.create(data);
  }

  async updatePassword(id: string, password: string) {
    return User.findByIdAndUpdate(id, { password }, { new: true });
  }

  async delete(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const authRepository = new AuthRepository();
