import axios from "axios";

export const orderApis = {
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}orders`);
      return response.data; // Assuming this returns an array of all orders
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  addOrder: async (orders) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BE_URL}orders`,
      orders
    );
    return response.data;
  },
};
