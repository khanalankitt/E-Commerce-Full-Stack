const CART_SERVICE_URL = process.env.CART_SERVICE_URL;

class CartClient {
  async getCart(userId: string) {
    const response = await fetch(
      `${CART_SERVICE_URL}/internal/carts/${userId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    return response.json();
  }

  async clearCart(userId: string) {
    const response = await fetch(
      `${CART_SERVICE_URL}/internal/carts/${userId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to clear cart");
    }

    return response.json();
  }
}

export default new CartClient();
