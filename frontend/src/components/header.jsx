import React from 'react';
import PropTypes from 'prop-types';
import banner from '../assets/images/banner.png';

export default function Header({ isOpen, onToggle }) {  return (
    <header className="header">
      <img src={banner} alt="Banner" className="header-banner" />
        <button className="header-menu-btn" onClick={onToggle}
style={{
            width: isOpen ? '240px' : '100px',
            transition: 'width .3s ease, ' +
                        'background-color 0.2s, ' +
                        'box-shadow 0.2s'
          }}>        
        <span className="hamburger-icon">☰</span>
        <span className="hamburger-text">Menu</span>
        </button>

    <button
       className="header-action-btn"
       onClick={() => window.location.href = '/homepage'}>
       Home
     </button>
     <button
       className="header-action-btn"
       onClick={() => {
         // TODO: gọi API logout hoặc xóa token rồi redirect
         window.location.href = '/login';
      }}>
       Đăng xuất
     </button>
    
    </header>
  );
}

Header.propTypes = {
  isOpen:  PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};
