import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/homepage", icon: "🏠", label: "Trang Chủ" },
  { to: "/student/search", icon: "👩‍🎓", label: "Hồ sơ học viên" },
  { to: "/subjects/list", icon: "🎓", label: "Chương trình đào tạo" },
  { to: "/schedules", icon: "📅", label: "Lịch dạy & Phân công" },
  { to: "/classes/search", icon: "📚", label: "Kết quả học tập" },
  { to: "/students", icon: "📖", label: "Tuyển sinh" },
  { to: "/exam-assign", icon: "📝", label: "Hình thức và nội dung thi" },
  
  // ... thêm các link khác ở đây ...
];

export default function Sidebar({ isOpen }) {
  return (
    <nav
      className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      style={{ transition: "width .3s ease" }}
    >
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className="sidebar-link">
              <span
                className="icon"
                style={{ fontSize: "1.75rem", transition: "font-size 0.3s" }}
              >
                {item.icon}
              </span>
              <span
                className="label"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(-20px)",
                }}
              >
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};
