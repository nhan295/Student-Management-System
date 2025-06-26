import React, { useState } from "react";
import api from "../api";
import "../styles/GraduateCert.css";

export default function GraduateCertPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCert, setEditedCert] = useState(null);

  // State cho modal Thêm mới
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    student_id: "",
    student_name: "",
    certificate_number: "",
    issue_date: "",
    is_issued: false,
  });
;

  const handleSearch = async (e) => {
    e.preventDefault();

    const term = searchTerm.trim();
    setError("");
    setLoading(true);

    try {
      let resp;
      if (!term) {
        resp = await api.get("/api/v1/graduation_certificates");
      } else {
        resp = await api.get(
          `/api/v1/graduation_certificates/${encodeURIComponent(term)}`
        );
      }
      const data = resp.data;
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      if (term && err.response?.status === 404) {
        setError("Không tìm thấy kết quả");
      } else {
        setError("Lỗi khi tìm kiếm");
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setError("");
  };

  const openDetail = (cert) => {
    setSelectedCert(cert);
    setEditedCert(cert);
    setEditMode(false);
  };

  const closeDetail = () => setSelectedCert(null);

  // Thêm mới
  const openAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setNewCert({
      student_id: "",
      student_name: "",
      certificate_number: "",
      issue_date: today,
      is_issued: true,
    });
    setIsAddOpen(true);
  };
  const closeAdd = () => setIsAddOpen(false);

  const handleStudentIdChange = async (e) => {
    const student_id = e.target.value;
    setNewCert((c) => ({ ...c, student_id, student_name: "" }));
    if (/^\d+$/.test(student_id)) {
      try {
        const resp = await api.get(`/api/v1/student/${student_id}`);
        setNewCert((c) => ({ ...c, student_name: resp.data.student_name }));
      } catch {
        setNewCert((c) => ({ ...c, student_name: "" }));
      }
    }
  };

  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCert((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/graduation_certificates", newCert);
      closeAdd();
      // fetchAll();
    } catch (err) {
      alert("Lỗi thêm mới: " + err.response?.data?.error || err.message);
    }
  };

  // Chuyển sang chế độ edit
  const handleStartEdit = () => setEditMode(true);

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditedCert(selectedCert);
    setEditMode(false);
  };

  // Lưu thay đổi
  const handleSaveEdit = async () => {
    try {
      await api.put(
        `/api/v1/graduation_certificates/${selectedCert.certificate_id}`,
        {
          certificate_number: editedCert.certificate_number,
          issue_date: editedCert.issue_date,
          is_issued: editedCert.is_issued,
        }
      );
      // cập nhật lại UI
      setSelectedCert(editedCert);
      setResults((prev) =>
        prev.map((c) =>
          c.certificate_id === editedCert.certificate_id ? editedCert : c
        )
      );
      setEditMode(false);
    } catch (err) {
      alert("Lỗi khi lưu: " + (err.response?.data?.error || err.message));
    }
  };

  // Xóa bản ghi

  // const handleDelete = async () => {
  //   if (!window.confirm("Bạn có chắc muốn xóa chứng chỉ này?")) return;
  //   try {
  //     await api.delete(
  //       `/api/v1/graduation_certificates/${selectedCert.certificate_id}`
  //     );
  //     setSelectedCert(null);
  //     setResults((prev) =>
  //       prev.filter((c) => c.certificate_id !== selectedCert.certificate_id)
  //     );
  //   } catch (err) {
  //     alert("Lỗi khi xóa: " + (err.response?.data?.error || err.message));
  //   }
  // };

  return (
    <div className="cert-container">
      <div className="cert-header">
        <h2 className="cert-title">Tra cứu Bằng Tốt Nghiệp</h2>
        <button className="btn-add" onClick={openAdd}>
          Thêm mới
        </button>
      </div>

      <form className="cert-input-group" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập mã hoặc tên học viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang tìm…" : "Tìm kiếm"}
        </button>
        <button type="button" onClick={clearSearch}>
          Xóa tìm
        </button>
      </form>

      {error && <p className="cert-error">{error}</p>}

      <div className="cert-list">
        {results.map((cert) => (
          <div key={cert.certificate_id} className="cert-summary">
            <span>
              {cert.student_name || "--"} — {cert.student_id || "--"}
            </span>
            <button onClick={() => openDetail(cert)}>Chi tiết</button>
          </div>
        ))}
      </div>

      {/* Modal Chi tiết */}
      {selectedCert && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div
            className="modal-content cert-display"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeDetail}>
              ×
            </button>

            <h3>Thông tin bằng tốt nghiệp</h3>

            <p>
              <strong>Học viên:</strong> {selectedCert.student_name}
            </p>
            <p>
              <strong>Mã học viên:</strong> {selectedCert.student_id}
            </p>
            <p>
              <strong>Số hiệu:</strong>
              {editMode ? (
                <input
                  value={editedCert.certificate_number}
                  onChange={(e) =>
                    setEditedCert((c) => ({
                      ...c,
                      certificate_number: e.target.value,
                    }))
                  }
                />
              ) : (
                selectedCert.certificate_number
              )}
            </p>
            <p>
              <strong>Ngày cấp:</strong>
              {editMode ? (
                <input
                  type="date"
                  value={editedCert.issue_date}
                  onChange={(e) =>
                    setEditedCert((c) => ({ ...c, issue_date: e.target.value }))
                  }
                />
              ) : (
                new Date(selectedCert.issue_date).toLocaleDateString("vi-VN")
              )}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              {editMode ? (
                <select
                  value={editedCert.is_issued ? "1" : "0"}
                  onChange={(e) =>
                    setEditedCert((c) => ({
                      ...c,
                      is_issued: e.target.value === "1",
                    }))
                  }
                >
                  <option value="1">Đã cấp</option>
                  <option value="0">Chưa cấp</option>
                </select>
              ) : selectedCert.is_issued ? (
                "Đã cấp"
              ) : (
                "Chưa cấp"
              )}
            </p>
            <div
              className="modal-actions"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              {editMode ? (
                <>
                  <button className="btn-confirm" onClick={handleSaveEdit}>
                    Lưu
                  </button>
                  <button onClick={handleCancelEdit}>Hủy</button>
                </>
              ) : (
                <>
                  <button onClick={handleStartEdit} className="graduate-fix-btn">Sửa</button>
                  {/* <button
                    onClick={handleDelete}
                    style={{ background: "#ef4444", color: "#fff" }}
                  >
                    Xóa
                  </button> */}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm mới */}
      {isAddOpen && (
        <div className="modal-overlay" onClick={closeAdd}>
          <div
            className="modal-content cert-display"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Thêm mới chứng chỉ</h3>

            <form onSubmit={handleAddSubmit}>
              <p>
                <strong>Mã học viên:</strong>
                <input
                  name="student_id"
                  value={newCert.student_id}
                  onChange={handleStudentIdChange}
                  placeholder="Nhập mã học viên"
                  required
                />
              </p>
              <p>
                <strong>Tên học viên:</strong>
                <input
                  name="student_name"
                  value={newCert.student_name}
                  disabled
                  placeholder="..."
                />
              </p>
              <p>
                <strong>Số hiệu:</strong>
                <input
                  name="certificate_number"
                  value={newCert.certificate_number}
                  onChange={handleNewChange}
                  placeholder="Nhập số hiệu"
                  required
                />
              </p>
              <p>
                <strong>Ngày cấp:</strong>
                <input
                  name="issue_date"
                  type="date"
                  value={newCert.issue_date}
                  onChange={handleNewChange}
                  required
                />
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <select
                  name="is_issued"
                  value={newCert.is_issued ? "1" : "0"}
                  onChange={(e) =>
                    setNewCert((c) => ({
                      ...c,
                      is_issued: e.target.value === "1",
                    }))
                  }
                >
                  <option value="1">Đã cấp</option>
                  <option value="0">Chưa cấp</option>
                </select>
              </p>

              <div className="modal-actions">
                <button type="submit" className="btn-confirm">
                  Lưu
                </button>
                <button type="button" onClick={closeAdd}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Kết thúc modal Thêm mới */}
    </div>
  );
}
