import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const KEY_CARTS_LIST = "key_carts_list";
const initialState = {
  carts: JSON.parse(localStorage.getItem(KEY_CARTS_LIST)) || [],
  totalQuantity: 0,
  totalPrice: 0,
  sizes: {},
};

const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.carts = [];
    },
    actAddProductToCarts: (state, action) => {
      const newProduct = action.payload;

      const existedItemIndex = state.carts.findIndex(
        (cart) => cart.id === newProduct.id && cart.size === newProduct.size
      );

      if (existedItemIndex > -1) {
        // Nếu sản phẩm cùng id và size đã tồn tại, cập nhật số lượng
        state.carts[existedItemIndex].quantity += newProduct.quantity;
      } else {
        // Nếu không, thêm sản phẩm mới vào giỏ hàng
        state.carts.push(newProduct);
      }

      localStorage.setItem(KEY_CARTS_LIST, JSON.stringify(state.carts));
      message.success("Add product to carts success!");
    },

    actDeleteProductInCarts: (state, action) => {
      const { id, size } = action.payload;
      state.carts = state.carts.filter(
        (cart) => !(cart.id === id && cart.size === size)
      );
      localStorage.setItem(KEY_CARTS_LIST, JSON.stringify(state.carts));
      message.success("Delete product in carts success!");
    },

    actClearCarts: (state, action) => {
      state.carts = [];
      localStorage.setItem(KEY_CARTS_LIST, JSON.stringify(state.carts));
      message.success("Clear carts success!");
    },

    actUpdateQuantityOfProduct: (state, action) => {
      const { id, quantity } = action.payload;
      const existedItemIndex = state.carts.findIndex((item) => item.id === id);
      state.carts[existedItemIndex].quantity = quantity;
      localStorage.setItem(KEY_CARTS_LIST, JSON.stringify(state.carts));
    },
    actUpdateSizeOfProduct: (state, action) => {
      const { id, size } = action.payload;

      // Tìm sản phẩm trong giỏ hàng bằng cách sử dụng id
      const existingItem = state.carts.find((item) => item.id === id);

      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      if (existingItem) {
        // Cập nhật kích thước của sản phẩm
        existingItem.size = size;

        // Cập nhật lại danh sách giỏ hàng trong state
        state.carts = [...state.carts];

        // Lưu danh sách giỏ hàng mới vào localStorage
        localStorage.setItem(KEY_CARTS_LIST, JSON.stringify(state.carts));
      }
    },
  },
});

export const {
  actAddProductToCarts,
  actDeleteProductInCarts,
  actClearCarts,
  actUpdateQuantityOfProduct,
  actUpdateSizeOfProduct,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
