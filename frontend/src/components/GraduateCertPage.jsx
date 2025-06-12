import React, { useState } from "react";
import "../styles/GraduateCertPage.css";

function GraduateCertPage() {
  const [studentId, setStudentId] = useState("");
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/graduation_certificates/student/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy bằng tốt nghiệp");
      }

      const data = await response.json();
      const certificate = Array.isArray(data) ? data[0] : data;

      if (!certificate) throw new Error("Không có dữ liệu hợp lệ");

      setCert(certificate);
      setError("");
    } catch (err) {
      setCert(null);
      setError(err.message);
    }

  };
  

  return (
    <div className="cert-container">
      <h2 className="cert-title">Tra cứu Bằng Tốt Nghiệp</h2>

      <div className="cert-input-group">
        <input
          type="text"
          placeholder="Nhập mã học viên (student_id)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {error && <p className="cert-error">{error}</p>}

      {cert && (
        <div className="cert-display">
          <h3>Thông tin bằng tốt nghiệp</h3>
          <p><strong>Số hiệu:</strong> {cert.certificate_number || "--"}</p>
          <p><strong>Ngày cấp:</strong> {cert.issue_date || "--"}</p>
          <p><strong>Xếp loại:</strong> {cert.classification || "--"}</p>
          <p><strong>Học viên:</strong> {cert.student_name || "--"}</p>
          <p><strong>Mã học viên:</strong> {cert.student_id || "--"}</p>
        </div>
      )}
    </div>
  );
}

export default GraduateCertPage;
