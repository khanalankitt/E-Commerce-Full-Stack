import { Cart } from "../../models/cart.model.js";

class CartRepository {
  async getCart(userId: string) {
    return Cart.findOne({ user: userId }).populate("items.product");
  }

  async add(userId: string, productId: string, quantity: number) {
    const existingCart = await Cart.findOne({
      user: userId,
      "items.product": productId,
    });

    if (existingCart) {
      return Cart.findOneAndUpdate(
        { user: userId, "items.product": productId },
        { $inc: { "items.$.quantity": quantity } },
        { returnDocument: "after" },
      );
    }

    return Cart.findOneAndUpdate(
      { user: userId },
      { $push: { items: { product: productId, quantity } } },
      { returnDocument: "after", upsert: true },
    );
  }

  async delete(userId: string, productId: string) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { returnDocument: "after" },
    );
  }

  async deleteAll(userId: string) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { returnDocument: "after" },
    );
  }
}

export default new CartRepository();
