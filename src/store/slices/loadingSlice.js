import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false, // Trạng thái loading mặc định
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true; // Bật trạng thái loading
    },
    stopLoading: (state) => {
      state.isLoading = false; // Tắt trạng thái loading
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
