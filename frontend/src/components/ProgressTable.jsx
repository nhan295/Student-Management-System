// src/pages/ProgressTable.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/ProgressTable.css";
import api from "../api.js"; // sử dụng axios instance

export default function ProgressTable({ studentId }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Gọi đúng endpoint backend: /api/v1/progress/{studentId}
    api
      .get(`/api/v1/progress/${studentId}`)
      .then((res) => {
        // res.data = { student_id, progress: [...] }
        setProgressData(res.data.progress || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải tiến độ học tập:", err);
        setError("Không tải được tiến độ học tập");
        setLoading(false);
      });
  }, [studentId]);

  if (loading) {
    return (
      <div className="progress-container">
        <p>Đang tải tiến độ học tập…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <table className="progress-table">
        <thead>
          <tr>
            <th colSpan="4" className="table-header">
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
              {/* Bạn có thể thêm nút QUAY LẠI hoặc thông tin tổng nếu cần */}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

ProgressTable.propTypes = {
  studentId: PropTypes.string.isRequired,
};
