import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Import the auth slice
import loadingReducer from "./slices/loadingSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

export default store;
