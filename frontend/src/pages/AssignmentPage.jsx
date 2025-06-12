import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../api";
import ShowAssign from "../components/ShowAssign";
import ConfirmDialog from "../components/formDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AssignmentPage.css";

function Assignment() {
  // ─── Form selections ───
  const [lecturer_id, setLecturer] = useState("");
  const [subject_id, setSubject] = useState("");
  const [class_id, setClass] = useState("");

  // ─── Options for selects ───
  const [lecturerOptions, setLecturerOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // ─── Assigned list ───
  const [assignedList, setAssignedList] = useState([]);

  // ─── ConfirmDialog state ───
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmParams({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmParams((cp) => ({ ...cp, isOpen: false }));
  };

  // ─── Load lookups on mount ───
  useEffect(() => {
    fetchLecturers();
    fetchSubjects();
    fetchClasses();
    loadAssigned();
  }, []);

  const fetchLecturers = async () => {
    try {
      const res = await api.get("/api/v1/lecturer/");
      const opts = res.data.map((l) => ({
        value: l.lecturer_id,
        label: l.lecturer_name,
      }));
      setLecturerOptions(opts);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách giảng viên");
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/api/v1/subjects/");
      const opts = res.data.map((s) => ({
        value: s.subject_id,
        label: s.subject_name,
      }));
      setSubjectOptions(opts);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách môn học");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get("/api/v1/classes/all-classes");
      const opts = res.data.map((c) => ({
        value: c.class_id,
        label: `${c.class_name} - ${c.course_name}`,
      }));
      setClassOptions(opts);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách lớp");
    }
  };

  const loadAssigned = async () => {
    try {
      const res = await api.get("/api/v1/assignment/");
      setAssignedList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách phân công");
    }
  };

  // ─── Perform API calls ───
  const performAdd = async () => {
    if (!lecturer_id || !subject_id || !class_id) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return;
    }
    try {
      await api.post("/api/v1/assignment/add", {
        lecturer_id,
        subject_id,
        class_id,
      });
      toast.success("Đã tạo phân công thành công");
      loadAssigned();
      // reset form
      setLecturer("");
      setSubject("");
      setClass("");
    } catch (error) {
      if (error.response?.status === 409 || error.response?.status === 500) {
        toast.warning("Phân công này đã tồn tại!");
      } else {
        toast.error("Đã xảy ra lỗi khi thêm phân công!");
      }
      console.error(error);
    }
  };

  const performDelete = async (assignment_id) => {
    try {
      await api.delete(`/api/v1/assignment/delete/${assignment_id}`);
      toast.success("Đã xoá phân công");
      loadAssigned();
    } catch (error) {
      console.error(error);
      toast.warning("Giảng viên đã có lịch học, không thể xoá phân công");
    }
  };

  const performEdit = async (assignment_id, values) => {
    try {
      await api.put(`/api/v1/assignment/edit/${assignment_id}`, values);
      toast.success("Đã cập nhật phân công");
      loadAssigned();
    } catch (error) {
      console.error(error);
      toast.warning("Đã xảy ra lỗi khi cập nhật phân công!");
    }
  };

  // ─── Handlers with confirm ───
  const handleAssign = (e) => {
    e.preventDefault();
    openConfirm({
      title: "Xác nhận thêm phân công",
      message: `Giảng viên: ${lecturer_id}\nMôn: ${subject_id}\nLớp: ${class_id}`,
      onConfirm: () => {
        performAdd();
        closeConfirm();
      },
    });
  };

  const handleDeleteClick = (assignment_id) => {
    openConfirm({
      title: "Xác nhận xoá",
      message: `Bạn có chắc muốn xoá phân công ID: ${assignment_id}?`,
      onConfirm: () => {
        performDelete(assignment_id);
        closeConfirm();
      },
    });
  };

  const handleEditClick = (assignment_id, values) => {
    openConfirm({
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc muốn cập nhật phân công ID: ${assignment_id}?`,
      onConfirm: () => {
        performEdit(assignment_id, values);
        closeConfirm();
      },
    });
  };

  return (
    <div className="assignment-page-root">
      <div className="assignment-main-grid">
        <div className="assignment-list-panel">
          <h2>Danh sách phân công</h2>
          <div className="assignment-list-container">
            {assignedList.map((a) => (
              <ShowAssign
                key={a.assignment_id}
                assignment={a}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                lecturerOptions={lecturerOptions}
                subjectOptions={subjectOptions}
                classOptions={classOptions}
              />
            ))}
          </div>
        </div>
        <div className="assignment-form-panel">
          <form onSubmit={handleAssign} className="assignment-form-container">
            <h1>Thêm phân công mới</h1>
            <label>Giảng viên</label>
            <Select
              options={lecturerOptions}
              onChange={(opt) => setLecturer(opt?.value || "")}
              placeholder="Chọn giảng viên..."
              isSearchable
            />
            <label>Môn học</label>
            <Select
              options={subjectOptions}
              onChange={(opt) => setSubject(opt?.value || "")}
              placeholder="Chọn môn học..."
            />
            <label>Lớp học</label>
            <Select
              options={classOptions}
              onChange={(opt) => setClass(opt?.value || "")}
              placeholder="Chọn lớp học..."
            />
            <button type="submit">Thêm phân công</button>
          </form>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />

      {/* Confirm Dialog */}
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

export default Assignment;
