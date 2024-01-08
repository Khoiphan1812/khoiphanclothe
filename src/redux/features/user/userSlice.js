import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApis from "../../../apis/userAPI";
import { setUserInfo } from "../auth/authSlice";

const initialState = {
  userDetails: {
    email: "",
    gender: "",
    fullName: "",
    phoneNumber: "",
    dob: "",
    province: "",
    district: "",
    ward: "",
    streetAddress: "",
    addressType: "",
  },
  isLoading: false,
  error: null,
};

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (email, { rejectWithValue }) => {
    try {
      const data = await userApis.getUserByEmail(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserDetailsAsync = createAsyncThunk(
  "user/updateUserDetails",
  async (userUpdate, thunkAPI) => {
    const userId = userUpdate.id;
    console.log(userId, "userId");
    if (!userId) {
      return thunkAPI.rejectWithValue("User ID is undefined");
    }

    try {
      const data = await userApis.updateUserById(userId, userUpdate);
      thunkAPI.dispatch(setUserInfo(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "An error occurred"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserDetailsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserDetailsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = { ...state.userDetails, ...action.payload };
      })
      .addCase(updateUserDetailsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
