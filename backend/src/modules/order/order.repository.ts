import { Order, type IOrder } from "../../models/order.model.js";

class OrderRepository {
  async create(data: Partial<IOrder>) {
    return Order.create(data);
  }

  async findByIdAndUser(orderId: string, userId: string) {
    return Order.findOne({ _id: orderId, user: userId })
      .populate("address")
      .populate("items.product");
  }

  async findAllByUser(userId: string) {
    return Order.find({ user: userId })
      .populate("address")
      .populate("items.product")
      .sort({ createdAt: -1 });
  }

  async updateStatus(
    orderId: string,
    userId: string,
    status: IOrder["status"],
  ) {
    return Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      { $set: { status } },
      { returnDocument: "after" },
    )
      .populate("address")
      .populate("items.product");
  }
}

export default new OrderRepository();
