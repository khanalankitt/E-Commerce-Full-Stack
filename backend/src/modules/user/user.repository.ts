import { User } from "../../models/user.model.js";

class UserRepository {
  async findById(id: string) {
    return User.findById(id).select("-password");
  }

  async findByIdWithPassword(id: string) {
    return User.findById(id).select("+password");
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async updateById(id: string, data: { name?: string; email?: string }) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async updatePassword(id: string, hashedPassword: string) {
    return User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );
  }
}

export default new UserRepository();
