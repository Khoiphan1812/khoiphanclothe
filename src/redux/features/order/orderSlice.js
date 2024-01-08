import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApis } from "../../../apis/orderAPI";

const initialState = {
  orders: [],
};

export const actAddOrder = createAsyncThunk(
  "order/addOrder",
  async (order, { rejectWithValue }) => {
    try {
      const response = await orderApis.addOrder(order);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actAddOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(actAddOrder.rejected, (state, action) => {
        console.error("Order failed:", action.payload); // Log or handle the error
      });
    //... xử lý các trạng thái khác của action nếu cần
  },
});

export default orderSlice.reducer;
