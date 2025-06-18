import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import "../styles/WarningsDetailPage.css";

export default function WarningsDetailPage() {
  const { classId, subjectId } = useParams();
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/v1/warnings/class/${classId}/subject/${subjectId}`)
      .then((res) => {
        const data = res.data;
        setRows(
          data.map((r, i) => {
            const pct = r.total_day
              ? Math.round((r.absent_day / r.total_day) * 100)
              : 0;
            return {
              ...r,
              stt: i + 1,
              percent: pct,
              status: pct >= 5, // ví dụ: >=25% là đã cảnh báo
            };
          })
        );
        if (data.length > 0) {
          setTitle(
            `Danh sách cảnh báo lớp ${data[0].class_name} học phần ${data[0].subject_name}`
          );
        }
      })
      .catch((err) => {
        console.error("Load detail error", err);
        setError("Không tải được dữ liệu");
      });
  }, [classId, subjectId]);

  if (error) return <p className="error">{error}</p>;
  if (!rows.length) return <p>Đang tải hoặc không có dữ liệu…</p>;

  return (
    <div className="wdp-container">
      <h2 className="wdp-header">{title}</h2>
      <table className="wdp-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>MSHV</th>
            <th>Họ và Tên</th>
            <th>Lớp</th>
            <th>Số buổi vắng/Tổng</th>
            <th>% vắng</th>
            <th>Ngày cảnh báo</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.warning_id} className={r.stt % 2 === 0 ? "even" : "odd"}>
              <td>{String(r.stt).padStart(3, "0")}</td>
              <td>{String(r.student_id).padStart(3, "0")}</td>
              <td>{r.student_name}</td>
              <td>{r.class_name}</td>
              <td>
                {r.absent_day}/{r.total_day}
              </td>
              <td>{r.percent}%</td>
              <td>{new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
              <td className="status">
                {r.status ? (
                  <span className="warned">❗ Đã cảnh báo</span>
                ) : (
                  <span className="not-warned">ℹ️ Chưa cảnh báo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
