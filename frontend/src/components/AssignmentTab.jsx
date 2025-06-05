// src/components/AssignmentTab.jsx

import React, { useState, useEffect } from "react";
import api from "../api";
import Select from "react-select";
import "../styles/AssignmentPage.css";
import "../styles/ShowAssign.css";

function ShowAssign({
  assignment,
  onDelete,
  onEdit,
  lecturerOptions = [],
  subjectOptions = [],
  classOptions = [],
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Ban đầu lát load assignment vào state để sửa
  const [editLecturer, setEditLecturer] = useState(assignment.lecturer_id);
  const [editSubject, setEditSubject] = useState(assignment.subject_id);
  const [editClass, setEditClass] = useState(assignment.class_id);

  const OpenEdit = () => {
    // Khi nhấn nút Sửa, gán lại giá trị hiện tại, rồi open modal
    setEditLecturer(assignment.lecturer_id);
    setEditSubject(assignment.subject_id);
    setEditClass(assignment.class_id);
    setShowEditModal(true);
  };

  const CloseEdit = () => setShowEditModal(false);

  const handleEdit = (e) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(assignment.id, {
        lecturer_id: editLecturer,
        subject_id: editSubject,
        class_id: editClass,
      });
    }
    setShowEditModal(false);
  };

  return (
    <div className="assignment-card">
      <h3>Phân công</h3>
      <div className="assign-container">
        <p>
          <strong>Giảng viên:</strong> {assignment.lecturer_name}
        </p>
        <p>
          <strong>Mã giảng viên:</strong> {assignment.lecturer_id}
        </p>
        <p>
          <strong>Môn học:</strong> {assignment.subject_name}
        </p>
        <p>
          <strong>Lớp học:</strong> {assignment.class_name}
        </p>
        <p>
          <strong>Khoá:</strong> {assignment.course_name}
        </p>
        <div style={{ marginTop: "10px" }}>
          <button className="edit-btn" onClick={OpenEdit}>
            Sửa
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete && onDelete(assignment.id)}
          >
            Xoá
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="edit-cart">
          <div className="modal-overlay">
            <div className="modal-content">
              <form onSubmit={handleEdit}>
                <label>Sửa phân công</label>

                <label>Giảng viên</label>
                <select
                  value={editLecturer}
                  onChange={(e) => setEditLecturer(e.target.value)}
                >
                  <option value="">Chọn giảng viên</option>
                  {lecturerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <label>Môn học</label>
                <select
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                >
                  <option value="">Chọn môn học</option>
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <label>Lớp học</label>
                <select
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value)}
                >
                  <option value="">Chọn lớp học</option>
                  {classOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button type="submit">Lưu</button>
                <button type="button" onClick={CloseEdit}>
                  Huỷ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignmentTab() {
  // State để giữ giá trị input của form thêm mới
  const [lecturer_id, setLecturer] = useState("");
  const [subject_id, setSubject] = useState("");
  const [class_id, setClass] = useState("");

  // Options cho react-select
  const [lecturerOptions, setLecturerOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // Danh sách phân công hiện có
  const [assignedList, setAssignedList] = useState([]);

  useEffect(() => {
    // Khi component mount, fetch dữ liệu lên
    getLecturer();
    getSubject();
    getClassList();
    showAssigned();
  }, []);

  const getLecturer = () => {
    api
      .get("/api/v1/lecturer/")
      .then((res) => {
        console.log(">>> API /lecturer/ trả về:", res.data);

        // Bắt array an toàn
        const arrLecturers = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const opts = arrLecturers.map((l) => ({
          value: l.lecturer_id,
          label: l.lecturer_name,
        }));

        setLecturerOptions(opts);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu giảng viên", err);
      });
  };

  const getSubject = () => {
    api
      .get("/api/v1/subjects/")
      .then((res) => {
        console.log(">>> API /subjects/ trả về:", res.data);

        const arrSubjects = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const opts = arrSubjects.map((s) => ({
          value: s.subject_id,
          label: s.subject_name,
        }));

        setSubjectOptions(opts);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu môn học", err);
      });
  };

  const getClassList = () => {
    api
      .get("/api/v1/classes/all-classes")
      .then((res) => {
        console.log(">>> API /classes/all-classes trả về:", res.data);

        const arrClasses = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const opts = arrClasses.map((c) => ({
          value: c.class_id,
          label: `${c.class_name} - ${c.course_name}`,
        }));

        setClassOptions(opts);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu lớp học", err);
      });
  };

  const showAssigned = () => {
    api
      .get("/api/v1/assignment/")
      .then((res) => {
        console.log(">>> API /assignment/ trả về:", res.data);

        const arrAssign = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setAssignedList(arrAssign);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách phân công", err);
      });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!lecturer_id || !subject_id || !class_id) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }
    console.log("Đang tạo phân công:", lecturer_id, subject_id, class_id);

    api
      .post("/api/v1/assignment/add", { lecturer_id, subject_id, class_id })
      .then((res) => {
        console.log(">>> POST /assignment/add trả về:", res);
        if (res.status === 200 || res.status === 201) {
          alert("Assignment created!");
          // sau khi thêm mới, load lại danh sách
          showAssigned();
          // reset form
          setLecturer("");
          setSubject("");
          setClass("");
        } else {
          alert("Assignment not created");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thêm phân công:", error);
        if (
          error.response &&
          (error.response.status === 500 || error.response.status === 409)
        ) {
          alert("Phân công này đã tồn tại!");
        } else {
          alert("Đã xảy ra lỗi khi thêm phân công!");
        }
      });
  };

  const delAssign = (id) => {
    api
      .delete(`/api/v1/assignment/delete/${id}`)
      .then((res) => {
        console.log(">>> DELETE /assignment/delete trả về:", res.status);
        if (res.status === 200) {
          alert("Đã xoá phân công");
          showAssigned();
        }
      })
      .catch((err) => {
        console.error("Lỗi khi xoá phân công", err);
      });
  };

  const editAssign = (id, { lecturer_id, subject_id, class_id }) => {
    api
      .put(`/api/v1/assignment/edit/${id}`, {
        lecturer_id,
        subject_id,
        class_id,
      })
      .then((res) => {
        console.log(">>> PUT /assignment/edit trả về:", res.status);
        if (res.status === 200) {
          alert("Đã cập nhật phân công");
          showAssigned();
        } else {
          alert("Không thể cập nhật phân công");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật phân công", error);
        alert("Đã xảy ra lỗi khi cập nhật phân công!");
      });
  };

  return (
    <div className="assignment-tab-container">
      {/* Danh sách phân công */}
      <div className="assignment-list">
        {Array.isArray(assignedList) && assignedList.length > 0
          ? assignedList.map((assignment) => (
              <ShowAssign
                key={assignment.id}
                assignment={assignment}
                onDelete={delAssign}
                onEdit={editAssign}
                lecturerOptions={lecturerOptions}
                subjectOptions={subjectOptions}
                classOptions={classOptions}
              />
            ))
          : null}
      </div>

      {/* Form thêm phân công mới */}
      <div className="assignment-form-container">
        <form onSubmit={handleAssign}>
          <h1>➕ Thêm phân công mới</h1>

          <label>Tên giảng viên</label>
          <Select
            options={lecturerOptions}
            onChange={(option) => setLecturer(option ? option.value : "")}
            placeholder="Chọn giảng viên..."
            isSearchable
            value={
              lecturerOptions.find((opt) => opt.value === lecturer_id) || null
            }
          />
          <label>Mã giảng viên</label>
          <input
            type="text"
            readOnly
            value={lecturer_id}
            placeholder="Tự động điền khi chọn giảng viên"
          />

          <label>Môn học</label>
          <Select
            options={subjectOptions}
            onChange={(option) => setSubject(option ? option.value : "")}
            placeholder="Chọn môn học"
            value={
              subjectOptions.find((opt) => opt.value === subject_id) || null
            }
          />

          <label>Lớp học</label>
          <Select
            options={classOptions}
            onChange={(option) => setClass(option ? option.value : "")}
            placeholder="Chọn lớp học"
            value={classOptions.find((opt) => opt.value === class_id) || null}
          />

          <button type="submit">Thêm phân công</button>
        </form>
      </div>
    </div>
  );
}

export default AssignmentTab;
