import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmDialog from "../components/FormDialog";
import "../styles/index.css";

export default function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", code: "", totalLessons: "" });
  const [original, setOriginal] = useState({
    name: "",
    code: "",
    totalLessons: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Load specific subject and all subjects for duplicate checks
  useEffect(() => {
    async function fetchData() {
      try {
        const [resSub, resAll] = await Promise.all([
          axios.get(`http://localhost:3000/api/v1/subjects/${id}`),
          axios.get("http://localhost:3000/api/v1/subjects"),
        ]);
        const { subject_name, subject_code, total_lessons } = resSub.data;
        setForm({
          name: subject_name,
          code: subject_code,
          totalLessons: total_lessons,
        });
        setOriginal({
          name: subject_name,
          code: subject_code,
          totalLessons: total_lessons,
        });
        setSubjects(resAll.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchData();
  }, [id]);

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmParams({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmParams((cp) => ({ ...cp, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, code, totalLessons } = form;

    // No changes
    if (name === original.name && code === original.code) {
      openConfirm({
        message: "Bạn chưa thay đổi tên hoặc mã học phần.",
        onConfirm: closeConfirm,
      });
      return;
    }
    // Duplicate name
    if (
      subjects.some(
        (s) => s.subject_name === name && s.subject_id !== Number(id)
      )
    ) {
      openConfirm({
        message: `Tên học phần "${name}" đã tồn tại.`,
        onConfirm: closeConfirm,
      });
      return;
    }
    // Duplicate code
    if (
      subjects.some(
        (s) => s.subject_code === code && s.subject_id !== Number(id)
      )
    ) {
      openConfirm({
        message: `Mã học phần "${code}" đã tồn tại.`,
        onConfirm: closeConfirm,
      });
      return;
    }

    // Confirm update
    openConfirm({
      title: "Xác nhận cập nhật",
      message: `Bạn có muốn cập nhật học phần thành:\nTên: ${name}\nMã: ${code}\nTổng số tiết: ${totalLessons}`,
      onConfirm: async () => {
        try {
          await axios.put(`http://localhost:3000/api/v1/subjects/${id}`, {
            subject_name: name,
            subject_code: code,
            total_lessons: Number(totalLessons),
          });
          alert(`Cập nhật thành công: ${name} (${code})`);
          navigate("/subjects/add");
        } catch (err) {
          console.error("Update error:", err);
          alert("Lỗi khi cập nhật học phần");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  return (
    <div className="form-container">
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Sửa học phần
      </h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 15 }}
        >
          <label style={{ width: 150 }}>Tên học phần:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
        >
          <label style={{ width: 150 }}>Mã học phần:</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
        >
          <label style={{ width: 150 }}>Tổng số tiết:</label>
          <input
            name="totalLessons"
            type="number"
            value={form.totalLessons}
            onChange={handleChange}
            required
            style={{
              flex: 1,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#fff",
              color: "#1976d2",
              border: "2px solid #1976d2",
              borderRadius: 24,
              cursor: "pointer",
            }}
          >
            <b>← Quay lại</b>
          </button>
          <button
            type="submit"
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 24,
              cursor: "pointer",
            }}
          >
            Cập nhật
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={confirmParams.title}
        message={confirmParams.message}
        onConfirm={confirmParams.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
