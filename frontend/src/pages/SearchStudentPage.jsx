import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/SearchStudentPage.css";

const SearchStudentPage = () => {
  const navigate = useNavigate();
  const [student_name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/v1/student/search/${student_name}`
      );
      setResults(response.data);
    } catch (error) { 
      console.error("Lỗi khi tìm kiếm học viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentId = (student_id)=>{
    navigate(`/student/detail/${student_id}`);
  }

  return (
    <div className="search-student-container">
      <h2>Tìm kiếm học viên</h2>
      <div className="search-student-input">
        <input
          type="text"
          value={student_name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên học viên"
        />
        <button onClick={handleSearch}>Tìm</button>
      </div>

      {loading ? (
        <p>Đang tìm kiếm...</p>
      ) : results.length > 0 ? (
        <div>
          {results.map((student) => (
            <div key={student.student_id}>
              <div className="result-student-info">
                <p>
                  <strong>Họ và tên:</strong> {student.student_name}
                </p>
                <p>
                  <strong>Mã học viên:</strong> {student.student_id}
                </p>
              </div>
              <div className="student-view-button">
                <button onClick={()=>getStudentId(student.student_id)}>Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="result-alert">
         
        </p>
      )}
    </div>
  );
};

export default SearchStudentPage;
