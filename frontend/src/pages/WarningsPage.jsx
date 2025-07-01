// src/pages/WarningsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "../styles/WarningsPage.css";
export default function WarningsPage() {
  const [classSubjects, setClassSubjects] = useState([]);
  const [error, setError] = useState(null);

  // State cho dropdown lọc
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    api
      .get("/api/v1/warnings/classes-subjects")
      .then((res) => {
        setClassSubjects(res.data);
      })
      .catch((err) => {
        console.error("Load class-subject warnings error", err);
        setError("Không tải được danh sách lớp–học phần có cảnh báo");
      });
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Unique options cho dropdown
  const classOptions = Array.from(
    new Set(classSubjects.map((cs) => cs.class_name))
  );
  const subjectOptions = Array.from(
    new Set(classSubjects.map((cs) => cs.subject_name))
  );

  // Lọc theo dropdown
  const filtered = classSubjects.filter((cs) => {
    return (
      (filterCourse === "" || cs.course_name === filterCourse) &&
      (filterClass === "" || cs.class_name === filterClass) &&
      (filterSubject === "" || cs.subject_name === filterSubject)
    );
  });

  const courseOptions = Array.from(
    new Set(classSubjects.map((cs) => cs.course_name))
  ).filter(Boolean); // tránh null/undefined nếu có

  const handleView = (classId, subjectId) => {
    // Điều hướng sang trang chi tiết cảnh báo của lớp & học phần này
    nav(`/warnings/class/${classId}/subject/${subjectId}`);
  };

  return (
    <div className="warnings-container">
      <div className="warnings-title-row">
        <span className="warnings-title">DANH SÁCH CÁC LỚP CÓ CẢNH BÁO</span>
      </div>
      <div className="warnings-filter-bar">
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="header-select"
        >
          <option value="">Tất cả lớp</option>
          {classOptions.map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="header-select"
        >
          <option value="">Tất cả khoá</option>
          {courseOptions.map((course, i) => (
            <option key={i} value={course}>
              {course}
            </option>
          ))}
        </select>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="header-select"
        >
          <option value="">Tất cả học phần</option>
          {subjectOptions.map((sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <table className="assignment-table">
        <thead>
          <tr className="sub-header">
            <th>Lớp</th>
            <th>Khoá</th>
            <th>Học phần</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((cs, idx) => (
              <tr
                key={`${cs.class_id}-${cs.subject_id}`}
                className={idx % 2 === 0 ? "even" : "odd"}
              >
                <td>{cs.class_name}</td>
                <td>
                  {/* Nếu cs.course_name là tên khoá */}
                  {cs.course_name}
                </td>
                <td>{cs.subject_name}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleView(cs.class_id, cs.subject_id)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                Không tìm thấy
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
