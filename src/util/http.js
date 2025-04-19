// api/api.js
import api from "./axiosInstance"; // axios instance đã được config sẵn interceptor
import { QueryClient } from "@tanstack/react-query";
import store from "../store/store";
import { login as loginAction } from "../store/slices/authSlice";

export const queryClient = new QueryClient();

// ====================== PUBLIC ======================

export const fetchHotels = async ({
  signal,
  page = 0,
  size = 12,
  name,
  locationId,
  rating,
  amenityIds,
  minPrice,
  maxPrice,
  minRoomsAvailable,
  hotelType,
  checkIn,
  checkOut,
  latitude,
  longitude,
}) => {
  let url = `/public/hotel/search?size=${size}&page=${page}`;

  if (name) url += `&name=${encodeURIComponent(name)}`;
  if (locationId) url += `&locationId=${locationId}`;
  if (rating) url += `&rating=${rating}`;
  if (amenityIds?.length > 0) url += `&amenityIds=${amenityIds.join(",")}`;
  if (minPrice) url += `&minPrice=${minPrice}`;
  if (maxPrice) url += `&maxPrice=${maxPrice}`;
  if (minRoomsAvailable) url += `&minRoomsAvailable=${minRoomsAvailable}`;
  if (hotelType) url += `&hotelType=${encodeURIComponent(hotelType)}`;
  if (checkIn) url += `&checkIn=${checkIn.toISOString()}`;
  if (checkOut) url += `&checkOut=${checkOut.toISOString()}`;
  if (latitude && longitude)
    url += `&latitude=${latitude}&longitude=${longitude}`;

  const res = await api.get(url, { signal });
  return res.data;
};

export const fetchHotel = async ({ signal, id }) => {
  const res = await api.get(`/public/hotel/${id}`, { signal });
  return res.data;
};

export const fetchOwner = async ({ signal, id }) => {
  const res = await api.get(`/public/owner/${id}`, { signal });
  return res.data;
};

export const fetchReviews = async ({ signal, id }) => {
  const res = await api.get(`/public/review/${id}`, { signal });
  return res.data;
};
export const fetchAmentiries = async () => {
  const res = await api.get("/public/amenity");
  return res.data;
};

export const fetchLocations = async () => {
  const res = await api.get("/public/location");
  return res.data;
};
export const hotelSearch = async (requestBody) => {
  const res = await api.post("/public/hotel/search", requestBody);
  return res.data;
};

export const fetchAddress = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const data = await response.json();
    if (data.address) {
      const { city, town, village, suburb, state, country } = data.address;
      return city || town || village || suburb || state || country;
    }
    return null;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

// ====================== AUTH ======================

export const signup = async (signupData) => {
  try {
    const res = await api.post("/auth/signup", {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Signup failed");
    }
  }
};

export const login = async (loginData) => {
  try {
    const res = await api.post("/auth/signin", {
      username: loginData.username,
      password: loginData.password,
    });

    const data = res.data;
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
};

export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      throw new Error("No refresh token found in localStorage");
    }

    const res = await api.post("/auth/refreshtoken", {
      refreshToken: storedRefreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      res.data;

    localStorage.setItem("accessToken", newAccessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    store.dispatch(loginAction());

    return res.data;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgotPassword", {
      email: email,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to send password reset email");
    }
  }
};

export const forgotPasswordConfirm = async (
  token,
  { newPassword, confirmPassword }
) => {
  try {
    const res = await api.post(`/auth/forgotPassword/${token}`, {
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to confirm password reset");
    }
  }
};

// ====================== USER ======================

export const userInfo = async () => {
  try {
    const res = await api.get("/user/info");
    console.log("User Info API Response:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to update profile");
    }
  }
};

export const updateProfile = async (requestBody) => {
  try {
    const res = await api.put("/user/updateProfile", requestBody);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      // Chuẩn hóa lỗi từ backend
      const errorMessages = Object.entries(error.response.data)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      throw new Error(errorMessages || "Failed to update profile.");
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};

export const changePassword = async (requestBody) => {
  try {
    const res = await api.post("/user/resetPassword", requestBody);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to change password");
    }
  }
};

export const checkout = async (requestBody) => {
  try {
    const res = await api.post("/user/booking", requestBody);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to checkout");
    }
  }
};
export const addFavorites = async (id) => {
  try {
    const res = await api.get("user/favorite/" + id);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to add favorite");
    }
  }
};
export const deleteFavorites = async (id) => {
  try {
    const res = await api.delete("user/favorite/" + id);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to delete favorite");
    }
  }
};
export const getFavorites = async () => {
  try {
    const res = await api.get("user/favorite");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to get favorites");
    }
  }
};
export const getUserBooking = async ({ page = 1, size = 10 }) => {
  try {
    const res = await api.get(`user/booking?page=${page}&size=${size}`);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to get user booking");
    }
  }
};

// ====================== HOTEL OWNER ======================
export const getHotelByOwner = async () => {
  try {
    const res = await api.get("hotelOwner/hotels");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to get hotels");
    }
  }
};
export const updateHotelByOwner = async (hotelId, requestBody) => {
  try {
    const res = await api.patch(
      "/hotelOwner/update/hotel/" + hotelId,
      requestBody
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to updateHotel");
    }
  }
};
export const addHotelByOwner = async (requestBody) => {
  try {
    const res = await api.post("/hotelOwner/createHotel", requestBody);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to addHotel");
    }
  }
};

// ====================== ADMIN ======================
export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch users");
    }
  }
};

export const unblockUser = async (userId) => {
  try {
    const res = await api.get(`/admin/unBlock/${userId}`);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to unblock user");
    }
  }
};

export const activateHotelOwner = async (userId) => {
  try {
    const res = await api.get(`/admin/active/${userId}`);
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to activate hotel owner");
    }
  }
};

export const blockUser = async (userId, banReason) => {
  try {
    const res = await api.post("/admin/block", {
      userId,
      banReason,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to block user");
    }
  }
};

export const dashboardOverview = async () => {
  try {
    const res = await api.get("/admin/dashboard/overview");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch dashboard overview");
    }
  }
};
export const dashboardMonthlyBooking = async () => {
  try {
    const res = await api.get("/admin/dashboard/monthlyBooking");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch monthly booking");
    }
  }
};
export const dashboardHotelByLocation = async () => {
  try {
    const res = await api.get("/admin/dashboard/hotelByLocation");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch hotel by location");
    }
  }
};
export const dashboardCombineChart = async () => {
  try {
    const res = await api.get("/admin/dashboard/combinedChart");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch combinedChart");
    }
  }
};
export const dashboardTopHotel = async ({ numTop = 10 }) => {
  try {
    const res = await api.get(
      `/admin/dashboard/top-hotels-revenue?numTop=${numTop}`
    );
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch top Hotel");
    }
  }
};

export const searchUser = async (keySearch) => {
  try {
    const response = await api.get(
      `/admin/users/search?keySearch=${encodeURIComponent(keySearch)}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Failed to fetch top Hotel");
    }
  }
};

export const getAllHotels = async ({
  signal,
  page = 0,
  size = 10,
  hotelId,
  ownerId,
  latitude,
  longitude,
}) => {
  let url = `/public/getHotel?page=${page}&size=${size}`;

  if (hotelId) url += `&hotelId=${hotelId}`;
  if (ownerId) url += `&ownerId=${ownerId}`;
  if (latitude) url += `&latitude=${latitude}`;
  if (longitude) url += `&longitude=${longitude}`;

  const res = await api.get(url, { signal });
  return res.data;
};

export const searchHotels = async ({
  signal,
  name,
  locationId,
  rating,
  amenityIds,
  minPrice,
  maxPrice,
  minRoomsAvailable,
  hotelType,
  checkIn,
  checkOut,
}) => {
  let url = `/public/hotel/search`;

  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (locationId) params.append("locationId", locationId);
  if (rating) params.append("rating", rating);
  if (amenityIds?.length > 0) params.append("amenityIds", amenityIds.join(","));
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (minRoomsAvailable) params.append("minRoomsAvailable", minRoomsAvailable);
  if (hotelType) params.append("hotelType", hotelType);
  if (checkIn) params.append("checkIn", checkIn.toISOString());
  if (checkOut) params.append("checkOut", checkOut.toISOString());

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const res = await api.get(url, { signal });
  return res.data;
};
