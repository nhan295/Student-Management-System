import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/ProgressTable.css";
import api from "../api.js";

export default function ProgressTable({ studentId, onClose }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state để bật hiệu ứng khi mount
  const [isVisible, setIsVisible] = useState(false);
  // state để kích hoạt hiệu ứng khi unmount
  const [isClosing, setIsClosing] = useState(false);

  // Khi component mount, set isVisible = true để slide‐in
  useEffect(() => {
    // một chút delay để CSS transition nhận diện
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Lấy dữ liệu tiến độ
  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get(`/api/v1/progress/${studentId}`)
      .then((res) => {
        setProgressData(res.data.progress || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải tiến độ học tập:", err);
        setError("Không tải được tiến độ học tập");
        setLoading(false);
      });
  }, [studentId]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 300ms trùng với transition-duration trong CSS
  };

  if (loading) {
    return (
      <div className="progress-container loading">
        Đang tải tiến độ học tập…
      </div>
    );
  }

  if (error) {
    return <div className="progress-container error">{error}</div>;
  }

  // Ghép className: mặc định "progress-container", khi isVisible → thêm "enter", khi isClosing → thêm "exit"
  const containerClass = [
    "progress-container",
    isVisible ? "enter" : "",
    isClosing ? "exit" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      <table className="progress-table">
        <thead>
          <tr>
            <th colSpan="4" className="table-header">
              <button
                className="close-btn"
                onClick={handleClose}
                aria-label="Quay lại"
              >
                <svg
                  className="close-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  role="img"
                  aria-labelledby="title-back-icon"
                >
                  <title id="title-back-icon">Back</title>
                  <defs>
                    <linearGradient
                      id="grad-close"
                      gradientTransform="rotate(135)"
                    >
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" fill="url(#grad-close)" rx="4" />
                  <path
                    d="M40 16 L24 32 L40 48"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              Kết quả học tập
            </th>
          </tr>
          <tr className="column-headers">
            <th className="col-stt">STT</th>
            <th className="col-code">Mã HP</th>
            <th className="col-name">Tên học phần</th>
            <th className="col-grade">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {progressData.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            progressData.map((row, idx) => (
              <tr
                key={row.subject_id}
                className={idx % 2 === 0 ? "row-light" : "row-dark"}
              >
                <td className="col-stt">{idx + 1}</td>
                <td className="col-code">{row.subject_code}</td>
                <td className="col-name">{row.subject_name}</td>
                <td className="col-grade">
                  {row.grade !== null ? row.grade : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="footer-cell">
              {/* Nếu cần thêm nút hoặc ghi chú, đặt ở đây */}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

ProgressTable.propTypes = {
  studentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
