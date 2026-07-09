import { Address, type IAddress } from "../../models/address.model.js";
import type { UpdateAddressInput } from "./address.validation.js";

class AddressRepository {
  async create(
    userId: string,
    data: Partial<import("../../models/address.model.js").IAddress>,
  ) {
    return Address.create({ ...data, user: userId });
  }

  async findAllByUser(userId: string) {
    return Address.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findById(addressId: string) {
    return Address.findById(addressId);
  }

  async findByIdAndUser(addressId: string, userId: string) {
    return Address.findOne({ _id: addressId, user: userId });
  }

  async update(addressId: string, userId: string, data: UpdateAddressInput) {
    return Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: data },
      { returnDocument: "after" },
    );
  }

  async delete(addressId: string, userId: string) {
    return Address.findOneAndDelete({ _id: addressId, user: userId });
  }

  async unsetDefaultForUser(userId: string) {
    return Address.updateMany(
      { user: userId, isDefaultShippingAddress: true },
      { $set: { isDefaultShippingAddress: false } },
    );
  }

  async setDefault(addressId: string, userId: string) {
    return Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: { isDefaultShippingAddress: true } },
      { returnDocument: "after" },
    );
  }

  async countByUser(userId: string) {
    return Address.countDocuments({ user: userId });
  }
}

export default new AddressRepository();
