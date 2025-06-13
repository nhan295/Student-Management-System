import React, { useState } from "react";
import "../styles/GraduateCert.css";

function GraduateCertPage() {
  const [studentId, setStudentId] = useState("");
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Ngăn reload khi submit form

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/graduation_certificates/student/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy bằng tốt nghiệp");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Phản hồi không phải định dạng JSON hợp lệ");
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Không có dữ liệu hợp lệ");
      }

      console.log("Dữ liệu bằng tốt nghiệp:", data);
      setCert(data);
      setError("");
    } catch (err) {
      setCert(null);
      setError(err.message);
    }
  };

  return (
    <div className="cert-container">
      <h2 className="cert-title">Tra cứu Bằng Tốt Nghiệp</h2>

      <form className="cert-input-group" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập mã học viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>

      {error && <p className="cert-error">{error}</p>}

      {cert && (
        <div className="cert-display">
          <h3>Thông tin bằng tốt nghiệp</h3>
          <p><strong>Số hiệu:</strong> {cert.certificate_number || "--"}</p>
          <p><strong>Ngày cấp:</strong> {new Date(cert.issue_date).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> {cert.is_issued ? "Đã cấp" : "Chưa cấp"}</p>
          <p><strong>Học viên:</strong> {cert.student_name || "--"}</p>
          <p><strong>Mã học viên:</strong> {cert.student_id || "--"}</p>
        </div>
      )}
    </div>
  );
}

export default GraduateCertPage;
