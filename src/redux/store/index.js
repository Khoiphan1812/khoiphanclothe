import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    auth: authReducer,
    carts: cartReducer,
    orders: orderReducer,
  },
});

export default store;
