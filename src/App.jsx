import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/HomePage";
import { HeaderMegaMenu } from "./components/header/HeaderMegaMenu";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { FooterLinks } from "./components/footer/FooterLinks";
import { HotelDetail } from "./components/hotelDetail/HotelDetail";
import { ScrollProgress } from "./components/ScrollProgress";
import NotFoundPage from "./components/notFoundPage/NotFound";
import { Outlet } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, userInfo, fetchAddress } from "./util/http";
import SuccessPage from "../pages/SuccessPage.jsx";
import CancelPage from "../pages/CancelPage.jsx";
import CustomBreadcrumbs from "./components/common/Breadcrumbs.jsx";
import ProfilePage from "./components/profile/ProfilePage";
import Infomation from "./components/profile/components/infomation/Infomation.jsx";
import OrderHistory from "./components/profile/components/BookingHistory.jsx";
import Dashboard from "./components/profile/components/dashboard/Dashboard.jsx";
import { UserManagement } from "./components/profile/components/userManagement/UserManagement";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store//slices/authSlice.js";
import Loading from "./components/common/Loading.jsx";
import HotelSearchPage from "./components/hotelSearch/HotelSearchPage.jsx";
import { OAuthCallback } from "./components/authenticationForm/OAuthCallback";
import { ForgotPasswordConfirm } from "./components/authenticationForm/ForgotPasswordConfirm";
import { OAuthFailed } from "./components/authenticationForm/OAuthFailed";
import { useLocationLanguage } from "./hooks/useLocationLanguage";
import { useTranslation } from "react-i18next";

function RootLayout() {
  const { locationLanguage } = useLocationLanguage();
  const { i18n } = useTranslation();

  // Set up debugging to log the current language
  useEffect(() => {
    console.log("Current language:", i18n.language);
    console.log("Detected language from location:", locationLanguage);
    console.log(
      "Language in local storage:",
      localStorage.getItem("i18nextLng")
    );
  }, [i18n.language, locationLanguage]);

  // Thay đổi ngôn ngữ dựa trên vị trí nếu người dùng chưa chọn ngôn ngữ
  useEffect(() => {
    // Chỉ thay đổi ngôn ngữ nếu đã phát hiện được và người dùng chưa đặt ngôn ngữ
    // hoặc nếu ngôn ngữ đã đặt là ngôn ngữ mặc định (en)
    if (
      locationLanguage &&
      (!localStorage.getItem("i18nextLng") ||
        localStorage.getItem("i18nextLng") === "en")
    ) {
      // Nếu đã phát hiện được ngôn ngữ từ vị trí và khác với ngôn ngữ hiện tại
      if (locationLanguage !== i18n.language) {
        i18n.changeLanguage(locationLanguage);
        console.log(
          `App: Changing language to: ${locationLanguage} based on geolocation`
        );
      }
    }
  }, [locationLanguage, i18n]);

  return (
    <>
      <ScrollProgress />
      <HeaderMegaMenu />
      <CustomBreadcrumbs />
      <main>
        <Outlet />
      </main>
      <FooterLinks />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/oauth2/success", element: <OAuthCallback /> },
      { path: "/oauth2/failed", element: <OAuthFailed /> },
      { path: "/forgotPassword", element: <ForgotPasswordConfirm /> },
      {
        path: "hotels",
        element: <HotelSearchPage />,
      },
      {
        path: "hotels/:id",
        element: <HotelDetail />,
      },
      { path: "payment/success", element: <SuccessPage /> },
      { path: "payment/cancel", element: <CancelPage /> },
      {
        path: "profile",
        element: <ProfilePage />,
        children: [
          { path: "", element: <Infomation /> },
          { path: "orderHistory", element: <OrderHistory /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "userManagement", element: <UserManagement /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  // Kiểm tra phiên đăng nhập
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await userInfo();
        dispatch(login(user));
      } catch (err) {
        console.error("Session check failed:", err);
        dispatch(logout());
      }
    };
    checkSession();
  }, [dispatch]);

  // Tự động phát hiện vị trí và cập nhật ngôn ngữ khi ứng dụng khởi động
  useEffect(() => {
    // Kiểm tra xem đã có ngôn ngữ được lưu trong session chưa
    if (sessionStorage.getItem("detectedLanguage")) {
      console.log(
        "Already have a language in session storage, skipping geolocation"
      );
      return;
    }

    // Hàm để phát hiện vị trí và đặt ngôn ngữ
    const detectLocationAndSetLanguage = async () => {
      if (navigator.geolocation) {
        try {
          console.log("App is requesting geolocation permission on startup...");
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                console.log(
                  `Position detected: lat=${latitude}, lng=${longitude}`
                );

                // Lấy thông tin địa chỉ từ API
                const locationName = await fetchAddress(latitude, longitude);
                console.log("App startup location:", locationName);

                // Lấy thông tin chi tiết từ Nominatim
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                );
                const data = await response.json();
                console.log("Startup location data:", data);

                // Lấy thành phố và quốc gia
                const country = data.address?.country;
                const city =
                  data.address?.city ||
                  data.address?.town ||
                  data.address?.village ||
                  data.address?.state;

                console.log(
                  `Detected at startup: City=${city}, Country=${country}`
                );

                // Bản đồ thành phố và ngôn ngữ
                const cityLangMap = {
                  Moscow: "ru",
                  "Saint Petersburg": "ru",
                  Москва: "ru",
                  "Санкт-Петербург": "ru",
                  Paris: "fr",
                  Lyon: "fr",
                  Tokyo: "ja",
                  Osaka: "ja",
                  Beijing: "zh",
                  Shanghai: "zh",
                  Seoul: "ko",
                  Busan: "ko",
                  Hanoi: "vi",
                  "Ho Chi Minh": "vi",
                  "Hồ Chí Minh": "vi",
                  Riyadh: "sa",
                };

                // Bản đồ quốc gia và ngôn ngữ
                const countryLangMap = {
                  Russia: "ru",
                  "Russian Federation": "ru",
                  France: "fr",
                  Japan: "ja",
                  China: "zh",
                  "South Korea": "ko",
                  "Korea, Republic of": "ko",
                  Vietnam: "vi",
                  "Saudi Arabia": "sa",
                  "United States": "en",
                  "United States of America": "en",
                  "United Kingdom": "en",
                };

                let detectedLanguage = null;

                // Kiểm tra thành phố trước
                if (city) {
                  if (cityLangMap[city]) {
                    detectedLanguage = cityLangMap[city];
                    console.log(
                      `Detected language ${detectedLanguage} from city ${city}`
                    );
                  } else {
                    // Tìm khớp một phần
                    for (const [cityKey, lang] of Object.entries(cityLangMap)) {
                      if (city.includes(cityKey) || cityKey.includes(city)) {
                        detectedLanguage = lang;
                        console.log(
                          `Detected language ${lang} from partial city match: ${cityKey} in ${city}`
                        );
                        break;
                      }
                    }
                  }
                }

                // Nếu không tìm thấy từ thành phố, thử từ quốc gia
                if (!detectedLanguage && country) {
                  if (countryLangMap[country]) {
                    detectedLanguage = countryLangMap[country];
                    console.log(
                      `Detected language ${detectedLanguage} from country ${country}`
                    );
                  } else {
                    // Tìm khớp một phần
                    for (const [countryKey, lang] of Object.entries(
                      countryLangMap
                    )) {
                      if (
                        country.includes(countryKey) ||
                        countryKey.includes(country)
                      ) {
                        detectedLanguage = lang;
                        console.log(
                          `Detected language ${lang} from partial country match: ${countryKey} in ${country}`
                        );
                        break;
                      }
                    }
                  }
                }

                // Trường hợp đặc biệt cho Moscow
                if (!detectedLanguage && locationName) {
                  if (
                    locationName.includes("Moscow") ||
                    locationName.includes("Москва")
                  ) {
                    detectedLanguage = "ru";
                    console.log(
                      "Detected Russian language based on Moscow location"
                    );
                  }
                }

                // Thay đổi ngôn ngữ nếu đã phát hiện được
                if (detectedLanguage) {
                  try {
                    // Lấy i18n object trực tiếp từ window object
                    if (window.i18n) {
                      window.i18n.changeLanguage(detectedLanguage);
                      console.log("Used window.i18n to change language");
                    } else {
                      // Import i18n và thay đổi ngôn ngữ
                      const i18n = (await import("./i18n")).default;
                      i18n.changeLanguage(detectedLanguage);
                    }

                    // Lưu vào cả localStorage và sessionStorage
                    localStorage.setItem("i18nextLng", detectedLanguage);
                    sessionStorage.setItem(
                      "detectedLanguage",
                      detectedLanguage
                    );

                    console.log(
                      `App startup: FORCED language change to ${detectedLanguage}`
                    );

                    // Đảm bảo UI được cập nhật bằng cách dispatch một event
                    window.dispatchEvent(
                      new CustomEvent("languageChanged", {
                        detail: { language: detectedLanguage },
                      })
                    );

                    // Force reload trang nếu cần thiết
                    if (import.meta.env.DEV) {
                      console.log("DEV mode: Not forcing page reload");
                    } else {
                      // Trong môi trường production có thể cân nhắc force reload
                      // window.location.reload();
                    }
                  } catch (langErr) {
                    console.error("Error changing language:", langErr);
                  }
                }
              } catch (err) {
                console.error("Error processing location data:", err);
              }
            },
            (err) => {
              console.error("Error getting geolocation at startup:", err);
            },
            { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
          );
        } catch (err) {
          console.error("Geolocation error at startup:", err);
        }
      } else {
        console.log("Geolocation is not supported by this browser");
      }
    };

    // Gọi hàm phát hiện vị trí và đặt ngôn ngữ
    detectLocationAndSetLanguage();
  }, []);

  return (
    <MantineProvider>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <Loading />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
