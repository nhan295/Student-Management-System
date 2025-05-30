import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import banner from "../assets/images/banner.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Header({ isOpen, onToggle }) {
  return (
    <header className="header">
      <img src={banner} alt="Banner" className="header-banner" />
      <button
        className="header-menu-btn"
        onClick={onToggle}
        style={{
          width: isOpen ? "240px" : "100px",
          transition:
            "width .3s ease, " + "background-color 0.2s, " + "box-shadow 0.2s",
        }}
      >
        <span className="hamburger-icon">☰</span>
        <span className="hamburger-text">Menu</span>
      </button>

      <NavLink to="/login" className="header-action-btn">
        <FontAwesomeIcon icon={faSignOutAlt} />
      </NavLink>
      <NavLink to="/homepage" className="header-action-btn" end>
        <FontAwesomeIcon icon={faHome} />
      </NavLink>
    </header>
  );
}

Header.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
