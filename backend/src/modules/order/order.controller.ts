import type { Request, Response, NextFunction } from "express";
import OrderService from "./order.service.js";
import { createOrderSchema } from "./order.validation.js";

class OrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { addressId } = createOrderSchema.parse(req.body);

      const order = await OrderService.createOrder(userId, addressId);

      res.status(201).json({
        success: true,
        message: "Order created",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { orderId } = req.params;

      const order = await OrderService.getOrder(String(orderId), userId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);

      const orders = await OrderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async place(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = String(req.user?._id);
      const { orderId } = req.params;

      const order = await OrderService.placeOrder(String(orderId), userId);

      res.status(200).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
