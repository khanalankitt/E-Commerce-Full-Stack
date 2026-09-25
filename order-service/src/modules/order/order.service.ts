import mongoose from "mongoose";
import OrderRepository from "./order.repository.js";
import CartRepository from "../cart/cart.repository.js";
import AddressRepository from "../address/address.repository.js";
import { OrderStatus } from "../../models/order.model.js";

class OrderService {
  async createOrder(userId: string, addressId: string) {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error("Invalid address ID");
    }

    const cart = await CartRepository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Your cart is empty");
    }

    const address = await AddressRepository.findByIdAndUser(addressId, userId);
    if (!address) {
      throw new Error("Address not found");
    }

    const items = cart.items.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price, // snapshot the price at purchase time
    }));

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    const order = await OrderRepository.create({
      user: new mongoose.Types.ObjectId(userId),
      address: new mongoose.Types.ObjectId(addressId),
      items,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    await CartRepository.deleteAll(userId);

    return OrderRepository.findByIdAndUser(String(order._id), userId);
  }

  async getOrder(orderId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID");
    }

    const order = await OrderRepository.findByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async getUserOrders(userId: string) {
    return OrderRepository.findAllByUser(userId);
  }

  async placeOrder(orderId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID");
    }

    const order = await OrderRepository.findByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error(
        "This order has already been placed or is no longer pending",
      );
    }

    return OrderRepository.updateStatus(
      orderId,
      userId,
      OrderStatus.PROCESSING,
    );
  }
}

export default new OrderService();
