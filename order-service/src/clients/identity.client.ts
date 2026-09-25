const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL;

class IdentityClient {
  async getAddress(userId: string, addressId: string) {
    const response = await fetch(
      `${IDENTITY_SERVICE_URL}/internal/users/${userId}/addresses/${addressId}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    return response.json();
  }
}

export default new IdentityClient();
