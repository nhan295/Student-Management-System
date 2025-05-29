import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/subjects/add',    icon: '🎓', label: 'Chương trình đào tạo' },
  { to: '/homepage', icon: '🏠', label: 'Trang Chủ' },
  // ... thêm các link khác ở đây ...
];

export default function Sidebar({ isOpen }) {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className="sidebar-link">
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired
};
