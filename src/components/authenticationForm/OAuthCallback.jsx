import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/slices/authSlice";
import { notifications } from "@mantine/notifications";
import { userInfo } from "../../util/http";

export function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthLogin = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const refreshToken = params.get("refresh");
      const avatar = params.get("avatar");

      if (token && refreshToken) {
        try {
          // Lưu token vào localStorage
          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);

          // Lấy thông tin người dùng đầy đủ
          const userData = await userInfo();

          // Dispatch action login với thông tin người dùng đầy đủ
          dispatch(loginAction(userData));

          // Hiển thị thông báo thành công
          notifications.show({
            title: "Login Successful",
            message: "You have logged in successfully!",
            color: "green",
          });

          // Chuyển hướng về trang chủ
          navigate("/");
        } catch (error) {
          // Xử lý lỗi nếu không lấy được thông tin người dùng
          notifications.show({
            title: "Login Failed",
            message: "Failed to get user information. Please try again.",
            color: "red",
          });
          navigate("/login");
        }
      } else {
        // Xử lý lỗi nếu không có token
        notifications.show({
          title: "Login Failed",
          message: "Failed to login with Google. Please try again.",
          color: "red",
        });
        navigate("/login");
      }
    };

    handleOAuthLogin();
  }, [location, navigate, dispatch]);

  return null;
}
