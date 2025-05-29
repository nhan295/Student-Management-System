import "../styles/HomePage.css";

function HomePage() {
    const menuItems = [
        { icon: "👩‍🎓", label: "Hồ sơ học viên" },
        { icon: "📋", label: "Chương trình đào tạo" },
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
                    <div className="menu-item" key={index}>
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
