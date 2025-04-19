import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
  authModalOpen: false, // Trạng thái để mở AuthenticationForm
  authModalType: "login", // Loại form: "login" hoặc "register"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log("Login action payload:", action.payload);
      state.isLoggedIn = true;
      state.userInfo = action.payload;
      state.authModalOpen = false; // Đóng modal khi đăng nhập thành công
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    openAuthModal(state, action) {
      state.authModalOpen = true; // Mở modal
      state.authModalType = action.payload || "login"; // Đặt loại form (mặc định là "login")
    },
    closeAuthModal(state) {
      state.authModalOpen = false; // Đóng modal
      state.authModalType = "login"; // Reset về "login" khi đóng modal
    },
  },
});

export const { login, logout, openAuthModal, closeAuthModal } =
  authSlice.actions;
export default authSlice.reducer;
