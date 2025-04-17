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
import { queryClient, userInfo } from "./util/http";
import SuccessPage from "../pages/SuccessPage.jsx";
import CancelPage from "../pages/CancelPage.jsx";
import CustomBreadcrumbs from "./components/common/Breadcrumbs.jsx";
import ProfilePage from "./components/profile/ProfilePage"; // Import the ProfilePage component
import Infomation from "./components/profile/components/infomation/Infomation.jsx";
import OrderHistory from "./components/profile/components/BookingHistory.jsx";
import Dashboard from "./components/profile/components/dashboard/Dashboard.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store//slices/authSlice.js";
import Loading from "./components/common/Loading.jsx";
import HotelSearchPage from "./components/hotelSearch/HotelSearchPage.jsx";

function RootLayout() {
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
          { path: "", element: <Infomation /> }, // Default when visiting /profile
          { path: "orderHistory", element: <OrderHistory /> },
          { path: "dashboard", element: <Dashboard /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await userInfo();
        dispatch(login(user));
      } catch (error) {
        dispatch(logout());
      }
    };
    checkSession();
  }, [dispatch]);

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
