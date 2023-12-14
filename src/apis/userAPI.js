// userAPI.js
import axios from "axios";

export const userApis = {
  getUserByEmail: async (email) => {
    const { data } = await axios.get(`${process.env.REACT_APP_BE_URL}user`, {
      params: { email },
    });
    return data;
  },

  createUserWithEmail: async (email) => {
    const user = {
      email,
      fullName: "",
      phoneNumber: "",
      dob: "",
      gender: "",
      province: "",
      district: "",
      ward: "",
      streetAddress: "",
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BE_URL}user`,
      user
    );
    return data;
  },

  updateUserById: async (userId, userUpdate) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_BE_URL}user/${userId}`,
      userUpdate
    );
    return response.data;
  },
};

export default userApis;
