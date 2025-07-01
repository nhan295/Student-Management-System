import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

import "../styles/SearchStudentPage.css";

const SearchStudentPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(
        "/api/v1/student/search",
        { params: { term: searchTerm.trim() } }
      );
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Không tìm thấy kết quả.");
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = (id) => {
    navigate(`/student/detail/${id}`);
  };

  return (
    <div className="search-student-container">
      <h2>Tìm kiếm học viên</h2>
      <div className="search-student-input">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên hoặc mã học viên"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Tìm</button>
      </div>

      {loading && <p>Đang tìm kiếm...</p>}

      {!loading && results.length > 0 && (
        <div className="results-list">
          {results.map((sv) => (
            <div key={sv.student_id} className="result-item">
              <div className="result-student-info">
                <p>
                  <strong>Họ và tên:</strong> {sv.student_name}
                </p>
                <p>
                  <strong>Mã học viên:</strong> {sv.student_id}
                </p>
              </div>
              <div className="student-view-button">
                <button onClick={() => viewDetail(sv.student_id)}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !results.length && (
        <p className="result-alert">Không tìm thấy kết quả.</p>
      )}
    </div>
  );
};

export default SearchStudentPage;
