import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ClassList.css";
import EnterGradeModal from "./EnterGradeModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClassList() {
  const [subjectId, setSubjectId] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedGrade, setEditedGrade] = useState("");
  const [classId, setClassId] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [showEnterModal, setShowEnterModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classRes, subjectRes] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/classes/all-classes", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/v1/classes/all-subjects", {
            withCredentials: true,
          }),
        ]);
        setClassOptions(classRes.data);
        setSubjectOptions(subjectRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Không tải được danh sách lớp hoặc môn học");
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!subjectId && !classId) {
      return toast.warn("Vui lòng chọn môn học hoặc lớp học");
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/classes/students-by-subject",
        {
          params: { subjectId, classId },
          withCredentials: true,
        }
      );
      setStudents(response.data);
      if (response.data.length === 0) {
        toast.info("Không tìm thấy sinh viên nào");
      } else {
        toast.success("Tìm kiếm thành công");
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      toast.error("Lỗi khi tìm kiếm dữ liệu");
    }
  };

  const handleUpdateGrade = async (student) => {
    if (editedGrade === "") {
      return toast.warn("Vui lòng nhập điểm trước khi lưu");
    }

    try {
      await axios.put(
        "http://localhost:3000/api/v1/classes/update-grade",
        {
          studentId: student.student_id,
          subjectName: student.subject_name,
          newGrade: editedGrade,
        },
        { withCredentials: true }
      );

      const updatedStudents = [...students];
      updatedStudents[editingIndex].grade = editedGrade;
      setStudents(updatedStudents);
      setEditingIndex(null);
      setEditedGrade("");
      toast.success("Cập nhật điểm thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật điểm:", error);
      toast.error("Cập nhật điểm thất bại");
    }
  };

  const handleExport = () => {
    if (!subjectId || !classId) {
      return toast.warn("Vui lòng chọn môn học và lớp học trước khi xuất");
    }
    const url = `http://localhost:3000/api/v1/classes/export-to-excel?subjectId=${subjectId}&classId=${classId}`;
    window.open(url, "_blank");
    toast.info("Đang xuất file Excel…");
  };

  return (
    <div className="classlist-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="classlist-title">📘 Danh sách điểm theo môn học</h2>

      <div className="classlist-search">
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">-- Chọn môn học --</option>
          {subjectOptions.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>

        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">-- Chọn lớp --</option>
          {classOptions.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name} ({cls.course_name})
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>🔍 Tìm kiếm</button>
        <button onClick={handleExport}>📁 Xuất Excel</button>
        <button onClick={() => setShowEnterModal(true)}>📝 Nhập điểm mới</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Môn học</th>
            <th>Tên sinh viên</th>
            <th>Mã lớp</th>
            <th>Điểm</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.subject_name}</td>
              <td>{student.student_name}</td>
              <td>{student.class_id}</td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="number"
                    value={editedGrade}
                    onChange={(e) => setEditedGrade(e.target.value)}
                  />
                ) : (
                  student.grade ?? <em style={{ color: "#999" }}>Chưa có điểm</em>
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => handleUpdateGrade(student)}
                      className="action-btn save-btn"
                    >
                      💾 Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditingIndex(null);
                        setEditedGrade("");
                      }}
                      className="action-btn cancel-btn"
                    >
                      ❌ Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setEditedGrade(student.grade ?? "");
                    }}
                    className="action-btn edit-btn"
                  >
                    ✏️ Sửa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EnterGradeModal visible={showEnterModal} onClose={() => setShowEnterModal(false)} />
    </div>
  );
}

export default ClassList;
