// subjectComponent.jsx
import React from 'react';
import '../styles/index.css';
import banner from '../assets/images/banner.png'; 

export default function Layout({ children }) {
  return (
<div className="layout">
<header>
      <img src={banner} alt="Banner" style={{ width: '100%', display: 'block' }} />
    </header>

      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li>🏫 Hồ sơ học viên</li>
          <li>📚 Tuyển sinh</li>
          <li>🎓 Chương trình đào tạo</li>
          <li>📝 Kết quả học tập</li>
          <li>🎖 Kết quả tốt nghiệp</li>
          <li>⚠️ Cảnh báo</li>
          <li>🏠 Trang chủ</li>
        </ul>
      </nav>

      {/* Nội dung chính */}
      <main className="main">
        {children}
      </main>
    </div>
  );
}
