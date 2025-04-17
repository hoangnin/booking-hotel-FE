import BookingByMonthChart from "./BookingByMonthChart";
import HotelByLocationChart from "./HotelByLocationChart";
import QuickOverview from "./QuickOverview";
import RevenueAndProfit from "./RevenueAndProfit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  startLoading,
  stopLoading,
} from "../../../../store/slices/loadingSlice";
import "./Dashboard.css";

export default function Dashboard() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Show loading state while any of the child components are loading
  const handleLoading = (isLoading) => {
    if (isLoading) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="dashboard-container">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-600">
            Please log in to view dashboard
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <QuickOverview onLoading={handleLoading} />

      <div className="charts-row">
        <div className="chart-box">
          <BookingByMonthChart onLoading={handleLoading} />
          <p className="chart-title">Bookings by Month</p>
        </div>

        <div className="chart-box">
          <HotelByLocationChart onLoading={handleLoading} />
          <p className="chart-title">
            Hotels by Location and top hotel's revenue
          </p>
        </div>
      </div>

      <div className="revenue-chart-box">
        <RevenueAndProfit onLoading={handleLoading} />
        <p className="chart-title">Revenue & Profit Overview</p>
      </div>
    </div>
  );
}
