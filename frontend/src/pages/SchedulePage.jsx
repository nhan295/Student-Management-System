import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/schedule.css";

//Phân công
function TeacherAssignmentTab() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/lookups/assignments")
      .then((res) => {
        if (res.data.success) {
          setAssignments(res.data.data);
        } else {
          setError("Không tải được danh sách phân công");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi khi fetch phân công");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Đang tải phân công giảng viên…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="form-title">Danh sách phân công Giảng viên</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Giảng viên</th>
              <th>Môn học</th>
              <th>Lớp học</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-gray-600 text-center">
                  Chưa có phân công nào.
                </td>
              </tr>
            ) : (
              assignments.map((item) => (
                <tr key={item.assignment_id}>
                  <td>{item.lecturer_name}</td>
                  <td>{item.subject_name}</td>
                  <td>{item.class_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Placeholder cho form phân công mới */}
      <div className="form-container" style={{ marginTop: "24px" }}>
        <p className="text-gray-600">
          [Placeholder: Form thêm/cập nhật phân công giảng viên sẽ nằm ở đây]
        </p>
      </div>
    </div>
  );
}
//Lịch học
function ScheduleTab() {
  const [schedules, setSchedules] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    schedule_id: null,
    study_date: "",
    room_id: "",
    subject_id: "",
    lecturer_id: "",
    class_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        schedRes,
        roomsRes,
        classesRes,
        subjectsRes,
        lecturersRes,
        assignRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/api/v1/schedules"),
        axios.get("http://localhost:3000/api/v1/lookups/rooms"),
        axios.get("http://localhost:3000/api/v1/lookups/classes"),
        axios.get("http://localhost:3000/api/v1/lookups/subjects"),
        axios.get("http://localhost:3000/api/v1/lookups/lecturers"),
        axios.get("http://localhost:3000/api/v1/lookups/assignments"),
      ]);

      if (schedRes.data.success) setSchedules(schedRes.data.data);
      if (roomsRes.data.success) setRooms(roomsRes.data.data);
      if (classesRes.data.success) setClasses(classesRes.data.data);
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
      if (lecturersRes.data.success) setLecturers(lecturersRes.data.data);
      if (assignRes.data.success) setAssignments(assignRes.data.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu từ server.");
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = () => {
    if (formData.lecturer_id) {
      const arr = assignments
        .filter((a) => String(a.lecturer_id) === formData.lecturer_id)
        .map((a) => ({
          subject_id: a.subject_id,
          subject_name: a.subject_name,
        }));
      const uniq = [];
      const seen = new Set();
      arr.forEach((item) => {
        if (!seen.has(item.subject_id)) {
          seen.add(item.subject_id);
          uniq.push(item);
        }
      });
      return uniq;
    }
    return subjects;
  };

  const lecturerOptions = () => {
    if (formData.subject_id) {
      const arr = assignments
        .filter((a) => String(a.subject_id) === formData.subject_id)
        .map((a) => ({
          lecturer_id: a.lecturer_id,
          lecturer_name: a.lecturer_name,
        }));
      const uniq = [];
      const seen = new Set();
      arr.forEach((item) => {
        if (!seen.has(item.lecturer_id)) {
          seen.add(item.lecturer_id);
          uniq.push(item);
        }
      });
      return uniq;
    }
    return lecturers;
  };

  const classOptions = () => {
    if (!formData.subject_id && !formData.lecturer_id) {
      return classes.map((c) => ({
        class_id: c.class_id,
        class_name: c.class_name,
      }));
    }
    let arr = assignments;
    if (formData.subject_id) {
      arr = arr.filter((a) => String(a.subject_id) === formData.subject_id);
    }
    if (formData.lecturer_id) {
      arr = arr.filter((a) => String(a.lecturer_id) === formData.lecturer_id);
    }
    const mapped = arr.map((a) => ({
      class_id: a.class_id,
      class_name: a.class_name,
    }));
    const uniq = [];
    const seen = new Set();
    mapped.forEach((item) => {
      if (!seen.has(item.class_id)) {
        seen.add(item.class_id);
        uniq.push(item);
      }
    });
    return uniq;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "subject_id") {
      setFormData((prev) => ({
        ...prev,
        subject_id: value,
        lecturer_id: "",
        class_id: "",
      }));
      return;
    }
    if (name === "lecturer_id") {
      const oldSub = formData.subject_id;
      const allowedSubs = assignments
        .filter((a) => String(a.lecturer_id) === value)
        .map((a) => String(a.subject_id));
      const newSub = allowedSubs.includes(oldSub) ? oldSub : "";

      setFormData((prev) => ({
        ...prev,
        lecturer_id: value,
        subject_id: newSub,
        class_id: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (row) => {
    setFormData({
      schedule_id: row.schedule_id,
      study_date: row.study_date.slice(0, 10),
      room_id: String(row.room_id),
      subject_id: String(row.subject_id),
      lecturer_id: String(row.lecturer_id),
      class_id: String(row.class_id),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      schedule_id,
      study_date,
      room_id,
      subject_id,
      lecturer_id,
      class_id,
    } = formData;
    if (!study_date || !room_id || !subject_id || !lecturer_id || !class_id) {
      alert("Vui lòng điền đầy đủ: Ngày, Phòng, Môn, Giáo viên và Lớp.");
      return;
    }
    const found = assignments.find(
      (a) =>
        String(a.subject_id) === subject_id &&
        String(a.lecturer_id) === lecturer_id &&
        String(a.class_id) === class_id
    );
    if (!found) {
      alert("Cặp (Giảng viên–Môn–Lớp) không tồn tại.");
      return;
    }
    const payload = {
      study_date,
      room_id: parseInt(room_id, 10),
      exSchedule_id: null,
      assignment_id: found.assignment_id,
    };
    try {
      if (isEditing && schedule_id) {
        await axios.put(
          `http://localhost:3000/api/v1/schedules/${schedule_id}`,
          payload
        );
        alert("Cập nhật thành công.");
      } else {
        await axios.post("http://localhost:3000/api/v1/schedules", payload);
        alert("Thêm lịch học thành công.");
      }
      await fetchAllData();
      setFormData({
        schedule_id: null,
        study_date: "",
        room_id: "",
        subject_id: "",
        lecturer_id: "",
        class_id: "",
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu. Vui lòng thử lại.");
    }
  };

  const handleDeleteClick = async (schedule_id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/schedules/${schedule_id}`
      );
      alert("Xóa thành công.");
      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Đang tải dữ liệu…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="form-container">
        <h2 className="form-title">
          {isEditing ? "Sửa lịch học" : "Thêm lịch học mới"}
        </h2>
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Ngày học */}
          <div className="form-group">
            <label>Ngày học</label>
            <input
              type="date"
              name="study_date"
              value={formData.study_date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Phòng học */}
          <div className="form-group">
            <label>Phòng học</label>
            <select
              name="room_id"
              value={formData.room_id}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name}
                </option>
              ))}
            </select>
          </div>

          {/* Môn học */}
          <div className="form-group">
            <label>Môn học</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">-- Chọn môn --</option>
              {subjectOptions().map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Giáo viên */}
          <div className="form-group">
            <label>Giáo viên</label>
            <select
              name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">-- Chọn giáo viên --</option>
              {lecturerOptions().map((lec) => (
                <option key={lec.lecturer_id} value={lec.lecturer_id}>
                  {lec.lecturer_name}
                </option>
              ))}
            </select>
          </div>

          {/* Lớp học */}
          <div className="form-group">
            <label>Lớp học</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">-- Chọn lớp --</option>
              {classOptions().map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút */}
          <div className="button-group">
            <button type="submit" className="button button-primary">
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  schedule_id: null,
                  study_date: "",
                  room_id: "",
                  subject_id: "",
                  lecturer_id: "",
                  class_id: "",
                });
                setIsEditing(false);
              }}
              className="button button-secondary"
            >
              {isEditing ? "Hủy sửa" : "Xóa form"}
            </button>
          </div>
        </form>
      </div>

      {/* BẢNG HIỂN THỊ SCHEDULE */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ngày học</th>
              <th>Phòng</th>
              <th>Lớp</th>
              <th>Môn học</th>
              <th>Giáo viên</th>
              <th>Chú thích</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-gray-600 text-center">
                  Không có lịch nào.
                </td>
              </tr>
            ) : (
              schedules.map((row) => (
                <tr key={row.schedule_id}>
                  <td>
                    {new Date(row.study_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{row.room_name}</td>
                  <td>{row.class_name}</td>
                  <td>{row.subject_name}</td>
                  <td>{row.lecturer_name}</td>
                  <td className="exam-note">
                    {row.exam_format
                      ? `${row.exam_format} (${new Date(
                          row.exam_date_es
                        ).toLocaleDateString("vi-VN")})`
                      : ""}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="button button-primary"
                      style={{
                        backgroundColor: "#facc15",
                        color: "#ffffff",
                        marginRight: "8px",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row.schedule_id)}
                      className="button button-primary"
                      style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="schedule-container">
      {/* Thanh tab */}
      <div className="tab-bar">
        <div className="tab-bar-inner">
          <button
            onClick={() => setActiveTab("assignment")}
            className={
              activeTab === "assignment" ? "tab-button active" : "tab-button"
            }
          >
            <span style={{ marginRight: "8px" }}>👩‍🏫</span>
            <span>Phân công Giảng viên</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={
              activeTab === "schedule" ? "tab-button active" : "tab-button"
            }
          >
            <span style={{ marginRight: "8px" }}>🗓️</span>
            <span>Sắp lịch Học</span>
          </button>
        </div>
      </div>

      {/* Nội dung tab */}
      <div className="tab-content">
        {activeTab === "assignment" && <TeacherAssignmentTab />}
        {activeTab === "schedule" && <ScheduleTab />}
      </div>
    </div>
  );
}
