import { NavbarNested } from "./ProfileNavbar";
import { Outlet } from "react-router-dom";
import "./ProfilePage.css"; // Tạo CSS để chia layout nếu cần

function ProfilePage() {
  return (
    <div className="profile-layout">
      <NavbarNested />
      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ProfilePage;
