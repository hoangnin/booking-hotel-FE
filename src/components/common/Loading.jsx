import { useSelector } from "react-redux";
export default function Loading() {
  const loading = useSelector((state) => state.loading.isLoading); // Lấy trạng thái globalLoading từ Redux

  if (!loading) return null;
  return (
    <div className="loading-overlay">
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/1200px-LEGO_logo.svg.png"
          alt="Loading"
          className="loading-logo"
        />
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
}
