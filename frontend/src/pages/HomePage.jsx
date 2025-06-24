import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images/banner.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ConfirmDialog from "../components/FormDialog";

function HomePage({ onLogout }) {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems = [
    { icon: "📖", label: "Tuyển sinh", path: "/students" },
    { icon: "👩‍🎓", label: "Hồ sơ học viên", path: "/student/search" },
    { icon: "📋", label: "Chương trình đào tạo", path: "/subjects/list" },
    { icon: "📝", label: "Hình thức và nội dung thi", path: "/exam-assign" },
    { icon: "📅", label: "Lịch giảng dạy và phân công", path: "/schedules" },
    { icon: "📚", label: "Kết quả học tập", path: "/classes/search" },
    { icon: "🎓", label: "Kết quả tốt nghiệp", path: "/cert/search" },
    { icon: "📊", label: "Điểm danh", path: "/attendance" },
    { icon: "⚠️", label: "Cảnh báo", path: "/warnings" },
  ];

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    onLogout();
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <div className="home-page">
      <header className="home-banner">
        <img src={banner} alt="Banner" className="header-banner" />

        <div className="banner-actions">
          <button
            className="header-action-btn"
            onClick={handleLogoutClick}
            title="Đăng xuất"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </header>

      <div className="home-bottom">
        {menuItems.map((item, index) => (
          <div
            className="menu-item"
            key={index}
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: item.path ? "pointer" : "default" }}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </div>
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default HomePage;
