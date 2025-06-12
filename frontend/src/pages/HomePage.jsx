import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import banner from "../assets/images/banner.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "👩‍🎓", label: "Hồ sơ học viên", path: "/student/search" },
    { icon: "📋", label: "Chương trình đào tạo", path: "/subjects/list" },
    { icon: "📅", label: "Lịch giảng dạy và phân công", path: "/schedules" },
    { icon: "📖", label: "Tuyển sinh", path: "/students" },
    { icon: "📚", label: "Kết quả học tập" },
    { icon: "🎓", label: "Kết quả tốt nghiệp" },
    { icon: "⚠️", label: "Cảnh báo học vụ", path: "/warnings" },
  ];

  return (
    <div className="home-page">
      <header className="home-banner">
        <img src={banner} alt="Banner" className="header-banner" />

        <div className="banner-actions">
          <NavLink to="/login" className="header-action-btn">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </NavLink>
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
    </div>
  );
}

export default HomePage;
