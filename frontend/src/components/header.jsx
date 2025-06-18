import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Navigate } from "react-router-dom";
import banner from "../assets/images/banner.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialog from "../components/formDialog";


export default function Header({ isOpen, onToggle, onLogout}) {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    onLogout();
    navigate("/login");
  };

  const handleCancelLogout = () => {
    console.log("Logout cancelled");
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <header className="header">
        <img src={banner} alt="Banner" className="header-banner" />
        <button
          className="header-menu-btn"
          onClick={onToggle}
          style={{
            width: isOpen ? "240px" : "100px",
            transition:
              "width .3s ease, " +
              "background-color 0.2s, " +
              "box-shadow 0.2s",
          }}
        >
          <span className="hamburger-icon">☰</span>
          <span className="hamburger-text">Menu</span>
        </button>
        {/* Home */}
        <button
          className="header-action-btn home-btn"
          title="Trang chủ"
          onClick={() => navigate("/homepage")}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
        {/* Logout với confirm */}
        <button
          className="header-action-btn logout-btn"
          onClick={handleLogoutClick}
          title="Đăng xuất"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </header>

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
}

Header.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};
