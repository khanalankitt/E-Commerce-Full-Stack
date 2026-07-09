import type { Request, Response, NextFunction } from "express";
import CartService from "./cart.service.js";

class CartController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const cart = await CartService.getCart(userId);

      res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const { productId, quantity } = req.body;

      const cart = await CartService.addToCart(
        userId,
        productId,
        quantity ?? 1,
      );

      res.status(200).json({
        success: true,
        message: "Item added to cart",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;
      const { productId } = req.params;

      const cart = await CartService.removeFromCart(userId, String(productId));

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id;

      const cart = await CartService.clearCart(userId);

      res.status(200).json({
        success: true,
        message: "Cart cleared",
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
