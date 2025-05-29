import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
        const menuItems = [
            { icon: "👩‍🎓", label: "Hồ sơ học viên" },
            {
              icon: "📋",
              label: "Chương trình đào tạo",
              path: "/subjects/add"       // thêm đường dẫn
            },
            { icon: "📖", label: "Tuyển sinh" },
            { icon: "📚", label: "Kết quả học tập" },
            { icon: "🎓", label: "Kết quả tốt nghiệp" },
            { icon: "⚠️", label: "Cảnh báo" }
        ];

    return (
        <div className="home-page">
            <div className="home-banner">
                <img src="../src/assets/images/banner.png" alt="banner" />
            </div>

            <div className="home-bottom">
            {menuItems.map((item, index) => (
                    <div
                      className="menu-item"
                      key={index}
                     onClick={() => {
                        if (item.path) navigate(item.path);
                      }}
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
