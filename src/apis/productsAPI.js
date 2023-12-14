import axios from "axios";

const BASE_URL = process.env.REACT_APP_BE_URL;

export const productApis = {
  getAllProducts: async () => {
    const response = await axios.get(`${BASE_URL}products`);
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await axios.get(`${BASE_URL}products/${productId}`);
    return response.data;
  },

  getAllImgsProduct: async () => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data.map((product) => ({
      id: product.imgProductId,
      imageUrl: product.image,
    }));
  },

  updateProductById: async (idProduct, productUpdate) => {
    const response = await axios.patch(
      `${BASE_URL}/products/${idProduct}`,
      productUpdate
    );
    return response.data;
  },

  createProduct: async (newProduct) => {
    const response = await axios.post(`${BASE_URL}/products`, newProduct);
    return response.data;
  },

  deleteProductById: async (idProduct) => {
    const response = await axios.delete(`${BASE_URL}/products/${idProduct}`);
    return response.data;
  },
};
