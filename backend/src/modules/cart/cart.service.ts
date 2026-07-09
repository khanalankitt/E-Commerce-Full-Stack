import CartRepository from "./cart.repository.js";
import mongoose from "mongoose";

class CartService {
  async getCart(userId: string) {
    const cart = await CartRepository.getCart(userId);

    if (!cart) {
      return { user: userId, items: [] };
    }

    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    return CartRepository.add(userId, productId, quantity);
  }

  async removeFromCart(userId: string, productId: string) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const updatedCart = await CartRepository.delete(userId, productId);
    if (!updatedCart) {
      throw new Error("Cart not found");
    }

    return updatedCart;
  }

  async clearCart(userId: string) {
    const clearedCart = await CartRepository.deleteAll(userId);
    if (!clearedCart) {
      throw new Error("Cart not found");
    }

    return clearedCart;
  }
}

export default new CartService();
