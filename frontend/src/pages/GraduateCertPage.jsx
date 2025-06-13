import React, { useState } from "react";
import "../styles/GraduateCert.css";

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

      console.log("Dữ liệu bằng tốt nghiệp:", certificate); // DEBUG
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
          <p><strong>Trạng thái:</strong> {cert.is_issued ? "Đã cấp" : "Chưa cấp"}</p>
          <p><strong>Học viên:</strong> {cert.student_name || "--"}</p>
          <p><strong>Mã học viên:</strong> {cert.student_id || "--"}</p>

          {/* DEBUG HIỂN THỊ TOÀN BỘ OBJECT */}
          <pre style={{ background: "#f9f9f9", padding: "8px" }}>
            {JSON.stringify(cert, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default GraduateCertPage;
