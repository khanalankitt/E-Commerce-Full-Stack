import mongoose from "mongoose";
import AddressRepository from "./address.repository.js";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "./address.validation.js";

class AddressService {
  async createAddress(userId: string, input: CreateAddressInput) {
    const existingCount = await AddressRepository.countByUser(userId);

    // First address for the user is always the default, regardless of input
    const shouldBeDefault =
      existingCount === 0 || input.isDefaultShippingAddress;

    if (shouldBeDefault && existingCount > 0) {
      await AddressRepository.unsetDefaultForUser(userId);
    }

    return AddressRepository.create(userId, {
      ...input,
      isDefaultShippingAddress: shouldBeDefault,
    });
  }

  async getUserAddresses(userId: string) {
    return AddressRepository.findAllByUser(userId);
  }

  async getAddress(addressId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error("Invalid address ID");
    }

    const address = await AddressRepository.findByIdAndUser(addressId, userId);

    if (!address) {
      throw new Error("Address not found");
    }

    return address;
  }

  async updateAddress(
    addressId: string,
    userId: string,
    input: UpdateAddressInput,
  ) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error("Invalid address ID");
    }

    const existing = await AddressRepository.findByIdAndUser(addressId, userId);
    if (!existing) {
      throw new Error("Address not found");
    }

    // If this update marks it default, unset every other address for the user first
    if (input.isDefaultShippingAddress) {
      await AddressRepository.unsetDefaultForUser(userId);
    }

    const updated = await AddressRepository.update(addressId, userId, input);
    return updated;
  }

  async deleteAddress(addressId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error("Invalid address ID");
    }

    const address = await AddressRepository.findByIdAndUser(addressId, userId);
    if (!address) {
      throw new Error("Address not found");
    }

    const wasDefault = address.isDefaultShippingAddress;

    await AddressRepository.delete(addressId, userId);

    if (wasDefault) {
      const remaining = await AddressRepository.findAllByUser(userId);
      const nextDefault = remaining[0];

      if (nextDefault) {
        await AddressRepository.setDefault(String(nextDefault._id), userId);
      }
    }

    return { deleted: true };
  }

  async setDefaultAddress(addressId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error("Invalid address ID");
    }

    const address = await AddressRepository.findByIdAndUser(addressId, userId);
    if (!address) {
      throw new Error("Address not found");
    }

    await AddressRepository.unsetDefaultForUser(userId);
    return AddressRepository.setDefault(addressId, userId);
  }
}

export default new AddressService();
