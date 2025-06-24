import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmDialog from "../components/FormDialog";
import "../styles/Index.css";

export default function AddSubject() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [totalLessons, setTotalLessons] = useState("");
  const [recentSubjects, setRecentSubjects] = useState([]);
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    mode: "",
    data: null,
  });
  const nav = useNavigate();

  // Load two most recent subjects
  const fetchRecent = async () => {
    try {
      const resp = await axios.get("http://localhost:3000/api/v1/subjects");
      const sorted = resp.data.sort((a, b) => b.subject_id - a.subject_id);
      setRecentSubjects(sorted.slice(0, 2));
    } catch (err) {
      console.error("Fetch recent error:", err);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  // Open confirm dialog
  const openConfirm = (mode, data) => {
    setConfirmParams({ isOpen: true, mode, data });
  };
  const closeConfirm = () => {
    setConfirmParams({ isOpen: false, mode: "", data: null });
  };

  // Handle the confirm action
  const handleConfirm = async () => {
    const { mode, data } = confirmParams;
    closeConfirm();
    try {
      if (mode === "add") {
        await axios.post("http://localhost:3000/api/v1/subjects", {
          subject_name: data.name,
          subject_code: data.code,
          total_lessons: Number(data.totalLessons),
        });
        alert(`Đã thêm: ${data.name} (${data.code})`);
        setSubjectName("");
        setSubjectCode("");
        setTotalLessons("");
        fetchRecent();
      } else if (mode === "delete") {
        await axios.delete(
          `http://localhost:3000/api/v1/subjects/${data.subject_id}`
        );
        alert(`Đã xóa: ${data.subject_name} (${data.subject_code})`);
        fetchRecent();
      }
    } catch (err) {
      console.error("Action error:", err);
      alert("Lỗi từ server");
    }
  };

  // Form submit for add
  const handleAdd = (e) => {
    e.preventDefault();
    openConfirm("add", { name: subjectName, code: subjectCode });
  };

  // Handle delete click
  const handleDeleteClick = (sub) => {
    openConfirm("delete", sub);
  };

  return (
    <div>
      <div className="form-container">
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Thêm học phần
        </h1>
        <form onSubmit={handleAdd} style={{ maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 15 }}
          >
            <label style={{ width: 150 }}>Tên học phần:</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Nhập tên học phần"
              style={{
                flex: 1,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
              required
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
          >
            <label style={{ width: 150 }}>Mã học phần:</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Nhập mã học phần"
              style={{
                flex: 1,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
              required
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
          >
            <label style={{ width: 150 }}>Tổng số tiết:</label>
            <input
              type="number"
              value={totalLessons}
              onChange={(e) => setTotalLessons(e.target.value)}
              placeholder="Nhập tổng số tiết"
              required
              style={{
                flex: 1,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              display: "block",
              margin: "0 auto",
              padding: "0.75rem 2rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 24,
              cursor: "pointer",
            }}
          >
            THÊM
          </button>
        </form>
      </div>

      {recentSubjects.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #1976d2",
            borderRadius: 8,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              color: "#1976d2",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Học phần đã thêm gần đây
          </h2>
          <ul>
            {recentSubjects.map((sub) => (
              <li
                key={sub.subject_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span>
                  <strong>{sub.subject_name}</strong> ({sub.subject_code})
                </span>
                <div>
                  <button
                    onClick={() => nav(`/subjects/edit/${sub.subject_id}`)}
                    style={{
                      marginRight: 8,
                      padding: "2px 8px",
                      border: "1px solid #1976d2",
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      color: "#1976d2",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(sub)}
                    style={{
                      padding: "2px 8px",
                      border: "1px solid #e53935",
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      color: "#e53935",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={
          confirmParams.mode === "add"
            ? "Xác nhận thêm học phần"
            : "Xác nhận xóa học phần"
        }
        message={
          confirmParams.mode === "add"
            ? `Bạn có chắc muốn thêm học phần?\nTên HP: ${
                confirmParams.data?.name
              }\nMã HP: ${confirmParams.data?.code}\nTổng số tiết: ${
                totalLessons || 0
              }`
            : `Bạn có chắc muốn xóa học phần?\nTên HP: ${confirmParams.data?.subject_name}\nMã HP: ${confirmParams.data?.subject_code}`
        }
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
