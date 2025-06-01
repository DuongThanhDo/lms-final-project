import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo giá trị mặc định từ localStorage (nếu có)
const initialState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { user, token } = action.payload;
      state.userInfo = user;
      state.token = token;
      state.isLoggedIn = true;

      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
    },
    logoutUser(state) {
      state.userInfo = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
