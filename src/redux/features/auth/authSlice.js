import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // Thông tin người dùng
  isLoggedIn: false, // Trạng thái đăng nhập
  isLoginModalVisible: false,
  isOTPChoiceModalVisible: false,
  isOTPInputModalVisible: false,
  email: "",
  otp: Array(4).fill(""),
  otpExpectedFromServer: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setOtpExpectedFromServer: (state, action) => {
      state.otpExpectedFromServer = action.payload;
    },
    toggleLoginModal: (state) => {
      state.isLoginModalVisible = !state.isLoginModalVisible;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    resetUserInfo: (state) => {
      state.userDetails = null;
      // Reset other user-related state as needed
    },
  },
});

export const {
  setUserInfo,
  logout,
  setEmail,
  setOtp,
  setOtpExpectedFromServer,
  toggleLoginModal,
  resetUserInfo,
} = authSlice.actions;
export default authSlice.reducer;
