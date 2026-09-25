import type { Request, Response, NextFunction } from "express";
import AddressService from "./address.service.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation.js";

class AddressController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const parsed = createAddressSchema.parse(req.body);

      const address = await AddressService.createAddress(userId, parsed);

      res.status(201).json({
        success: true,
        message: "Address added successfully",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);

      const addresses = await AddressService.getUserAddresses(userId);

      res.status(200).json({
        success: true,
        message: "Addresses fetched successfully",
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { addressId } = req.params;

      const address = await AddressService.getAddress(
        String(addressId),
        userId,
      );

      res.status(200).json({
        success: true,
        message: "Address fetched successfully",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { addressId } = req.params;
      const parsed = updateAddressSchema.parse(req.body);

      const address = await AddressService.updateAddress(
        String(addressId),
        userId,
        parsed,
      );

      res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { addressId } = req.params;

      await AddressService.deleteAddress(String(addressId), userId);

      res.status(200).json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefault(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { addressId } = req.params;

      const address = await AddressService.setDefaultAddress(
        String(addressId),
        userId,
      );

      res.status(200).json({
        success: true,
        message: "Default address updated",
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController();
