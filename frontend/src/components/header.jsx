import React from 'react';
import PropTypes from 'prop-types';
import banner from '../assets/images/banner.png';

export default function Header({ onToggle }) {  return (
    <header className="header">
      <img src={banner} alt="Banner" className="header-banner" />
        <button className="header-menu-btn" onClick={onToggle}>
        <span className="hamburger-icon">☰</span>
        <span className="hamburger-text">Menu</span>
        </button>
    </header>
  );
}

Header.propTypes = {
  onToggle: PropTypes.func.isRequired
};
