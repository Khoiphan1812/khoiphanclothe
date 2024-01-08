import axios from "axios";

export const productApis = {
  getAllProducts: async (params) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URL}products`,
      {
        params: params,
      }
    );
    return response;
  },

  getProductById: async (productId) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URL}products/${productId}`
    );
    return response.data;
  },

  getAllImgsProduct: async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URLL}products`
    );
    return response.data.map((product) => ({
      id: product.imgProductId,
      imageUrl: product.image,
    }));
  },

  updateProductById: async (idProduct, productUpdate) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_BE_URL}products/${idProduct}`,
      productUpdate
    );
    return response.data;
  },

  searchProducts: async (searchQuery) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BE_URL}products`,
      { params: { q: searchQuery } }
    );
    return response.data;
  },
};
