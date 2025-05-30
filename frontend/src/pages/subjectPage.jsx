import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SubjectPage.css";

const PAGE_SIZE = 5;

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  const navigate = useNavigate();

  // Subject fetch
  const fetchSubjects = async () => {
    try {
      const resp = await axios.get("http://localhost:3000/api/v1/subjects");
      setSubjects(resp.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách học phần");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Search
  const filtered = subjects.filter(
    (s) =>
      s.subject_code.toLowerCase().includes(query.toLowerCase()) ||
      s.subject_name.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  const blanksCount = PAGE_SIZE - paginated.length;

  return (
    <div className="subject-page">
      <div className="search-bar">
        <label>Mã số hoặc tên HP:</label>
        <input
          type="text"
          placeholder="Nhập từ khóa..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => {}}>🔍 Tìm</button>
      </div>

      <h2 className="page-title">Danh mục học phần</h2>

      <table className="subject-table">
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "45%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>

        <thead>
          <tr>
            <th>STT</th>
            <th>Mã HP</th>
            <th>Tên học phần</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {/* 1) render dữ liệu */}
          {paginated.map((s, idx) => (
            <tr key={s.subject_id} className={idx % 2 === 1 ? "odd" : ""}>
              <td>{startIdx + idx + 1}</td>
              <td>{s.subject_code}</td>
              <td>{s.subject_name}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/subjects/edit/${s.subject_id}`)}
                >
                  Sửa
                </button>
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(s.subject_id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {/* 2) sau khi hết data, thêm hàng trống cho đủ PAGE_SIZE */}
          {Array.from({ length: blanksCount }).map((_, i) => (
            <tr key={`blank-${i}`} className="blank-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ‹ Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Tiếp ›
        </button>
      </div>

      <div className="add-button-container">
        <button className="btn-add" onClick={() => navigate("/subjects/add")}>
          Thêm học phần
        </button>
      </div>
    </div>
  );
}
