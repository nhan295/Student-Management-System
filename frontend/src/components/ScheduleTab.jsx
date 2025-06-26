/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import api from "../api";
import WeeklyTimeline from "./WeeklyTimeline";
import ConfirmDialog from "./FormDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Schedule.css";

export default function ScheduleTab() {
  // ─── State chính ───
  const [schedules, setSchedules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [currentSunday, setCurrentSunday] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 0 : -day;
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Form state ───
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    schedule_id: null,
    study_date: "",
    start_time: "",
    end_time: "",
    room_id: "",
    subject_id: "",
    lecturer_id: "",
    class_id: "",
  });

  // ─── Lookup cho dropdown ───
  const [rooms, setRooms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // ─── State cho ConfirmDialog ───
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

  // ─── 1. Fetch lookups khi mount ───
  useEffect(() => {
    async function fetchLookups() {
      try {
        const [lecRes, roomRes, classRes, subRes, assignRes] =
          await Promise.all([
            api.get("/api/v1/lookups/lecturers"),
            api.get("/api/v1/lookups/rooms"),
            api.get("/api/v1/lookups/classes"),
            api.get("/api/v1/lookups/subjects"),
            api.get("/api/v1/lookups/assignments"),
          ]);

        if (lecRes.data.success) setLecturers(lecRes.data.data);
        if (roomRes.data.success) setRooms(roomRes.data.data);
        if (classRes.data.success) setClasses(classRes.data.data);
        if (subRes.data.success) setSubjects(subRes.data.data);
        if (assignRes.data.success) setAssignments(assignRes.data.data);
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu lookup.");
        setError("Lỗi khi tải dữ liệu lookup.");
      }
    }
    fetchLookups();
  }, []);

  // ─── 2. Fetch schedules ───
  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      setError("");
      const yyyy = currentSunday.getFullYear();
      const mm = String(currentSunday.getMonth() + 1).padStart(2, "0");
      const dd = String(currentSunday.getDate()).padStart(2, "0");
      const startDate = `${yyyy}-${mm}-${dd}`;
      const saturday = new Date(currentSunday);
      saturday.setDate(currentSunday.getDate() + 6);
      const yyyy2 = saturday.getFullYear();
      const mm2 = String(saturday.getMonth() + 1).padStart(2, "0");
      const dd2 = String(saturday.getDate()).padStart(2, "0");
      const endDate = `${yyyy2}-${mm2}-${dd2}`;
      let url = `${api.defaults.baseURL}/api/v1/schedules?startDate=${startDate}&endDate=${endDate}`;
      if (selectedLecturer) url += `&lecturer_id=${selectedLecturer}`;
      try {
        const res = await api.get(url);
        if (res.data.success) setSchedules(res.data.data);
        else setError("Không tải được lịch.");
      } catch (err) {
        toast.error("Không tải được lịch.");
        setError("Không tải được lịch.");
      } finally {
        setLoading(false);
      }
    }
    fetchSchedules();
  }, [currentSunday, selectedLecturer]);

  // ─── 3. Chuyển tuần ───
  const prevWeek = () => {
    const prev = new Date(currentSunday);
    prev.setDate(prev.getDate() - 7);
    setCurrentSunday(prev);
  };
  const nextWeek = () => {
    const next = new Date(currentSunday);
    next.setDate(next.getDate() + 7);
    setCurrentSunday(next);
  };
  const goToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 0 : -day;
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    sunday.setHours(0, 0, 0, 0);
    setCurrentSunday(sunday);
  };

  // ─── 4. Lọc dropdown ───
  const lecturersForSubject = useMemo(() => {
    if (!formData.subject_id) return [];
    const filtered = assignments.filter(
      (a) => String(a.subject_id) === formData.subject_id
    );
    const unique = [];
    const seen = new Set();
    for (let a of filtered)
      if (!seen.has(a.lecturer_id)) {
        seen.add(a.lecturer_id);
        unique.push({
          lecturer_id: a.lecturer_id,
          lecturer_name: a.lecturer_name,
        });
      }
    return unique;
  }, [assignments, formData.subject_id]);
  const classesForSelection = useMemo(() => {
    if (!formData.subject_id || !formData.lecturer_id) return [];
    const filtered = assignments.filter(
      (a) =>
        String(a.subject_id) === formData.subject_id &&
        String(a.lecturer_id) === formData.lecturer_id
    );
    const unique = [];
    const seen = new Set();
    for (let a of filtered)
      if (!seen.has(a.class_id)) {
        seen.add(a.class_id);
        unique.push({ class_id: a.class_id, class_name: a.class_name });
      }
    return unique;
  }, [assignments, formData.subject_id, formData.lecturer_id]);

  // ─── Helpers ───
  const parseTimeToMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(":").map((x) => parseInt(x, 10));
    return hh * 60 + mm;
  };
  const toLocalDateString = (iso) => {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const fetchSchedulesOfDay = async (dateString) => {
    try {
      const res = await api.get(
        `/api/v1/schedules?study_date=${dateString}`
      );
      return res.data.success ? res.data.data : [];
    } catch {
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "subject_id")
        return { ...prev, subject_id: value, lecturer_id: "", class_id: "" };
      if (name === "lecturer_id")
        return { ...prev, lecturer_id: value, class_id: "" };
      return { ...prev, [name]: value };
    });
  };

  const resetForm = () => {
    setFormData({
      schedule_id: null,
      study_date: "",
      start_time: "",
      end_time: "",
      room_id: "",
      subject_id: "",
      lecturer_id: "",
      class_id: "",
    });
    setIsEditing(false);
  };

  // ─── Thực sự lưu ───
  const performSave = async () => {
    const {
      schedule_id,
      study_date,
      start_time,
      end_time,
      room_id,
      subject_id,
      lecturer_id,
      class_id,
    } = formData;
    // validate
    if (
      !study_date ||
      !start_time ||
      !end_time ||
      !room_id ||
      !subject_id ||
      !lecturer_id ||
      !class_id
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const newStart = parseTimeToMinutes(start_time),
      newEnd = parseTimeToMinutes(end_time);
    if (newEnd <= newStart) {
      toast.error("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return;
    }
    const found = assignments.find(
      (a) =>
        String(a.subject_id) === subject_id &&
        String(a.lecturer_id) === lecturer_id &&
        String(a.class_id) === class_id
    );
    if (!found) {
      toast.error("Cặp (Học phần – Giảng viên – Lớp) không tồn tại.");
      return;
    }
    // check conflict
    const schedulesOfDay = await fetchSchedulesOfDay(study_date);
    for (const row of schedulesOfDay) {
      if (isEditing && row.schedule_id === schedule_id) continue;
      if (toLocalDateString(row.study_date) !== study_date) continue;
      const exLect = Number(row.lecturer_id),
        exCl = Number(row.class_id),
        newLect = Number(lecturer_id),
        newCl = Number(class_id);
      if (exLect === newLect || exCl === newCl) {
        const existStart = parseTimeToMinutes(row.start_time.slice(0, 5)),
          existEnd = parseTimeToMinutes(row.end_time.slice(0, 5));
        if (newStart < existEnd && newEnd > existStart) {
          toast.error(
            `Xung đột lịch: ${
              exCl === newCl ? "Lớp này" : "Giáo viên này"
            } đã có lịch trùng giờ.`
          );
          return;
        }
      }
    }
    // payload & API
    const payload = {
      study_date,
      start_time,
      end_time,
      room_id: Number(room_id),
      assignment_id: found.assignment_id,
    };
    try {
      if (isEditing && schedule_id) {
        await api.put(
          `/api/v1/schedules/${schedule_id}`,
          payload
        );
        toast.success("Cập nhật thành công.");
      } else {
        await api.post("/api/v1/schedules", payload);
        toast.success("Thêm lịch học thành công.");
      }
      goToday();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.warning("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // ─── Mở dialog trước khi lưu ───
  const handleFormSubmit = (e) => {
    e.preventDefault();
    openConfirm({
      title: isEditing ? "Xác nhận cập nhật" : "Xác nhận thêm",
      message: isEditing
        ? "Bạn có chắc muốn cập nhật lịch học này?"
        : "Bạn có chắc muốn thêm lịch học mới?",
      onConfirm: () => {
        performSave();
        closeConfirm();
      },
    });
  };

  // ─── Sửa ───
  const handleEditClick = (row) => {
    setFormData({
      schedule_id: row.schedule_id,
      study_date: toLocalDateString(row.study_date),
      start_time: row.start_time.slice(0, 5),
      end_time: row.end_time.slice(0, 5),
      room_id: String(row.room_id),
      subject_id: String(row.subject_id),
      lecturer_id: String(row.lecturer_id),
      class_id: String(row.class_id),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Xóa ───
  const performDelete = async (id) => {
    try {
      await api.delete(`/api/v1/schedules/${id}`);
      toast.success("Xóa thành công.");
      goToday();
    } catch (err) {
      console.error(err);
      toast.warning("Lỗi khi xóa.");
    }
  };
  const handleDeleteClick = (id) => {
    openConfirm({
      title: "Xác nhận xóa lịch",
      message: `Bạn có chắc chắn muốn xóa lịch ID ${id}?`,
      onConfirm: () => {
        performDelete(id);
        closeConfirm();
      },
    });
  };

  // ─── Loading / Error ───
  if (loading)
    return (
      <div className="loading-container">
        <p>Đang tải dữ liệu…</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

  // ─── Render ───
  return (
    <div className="schedule-page">
      <WeeklyTimeline
        schedules={schedules}
        lecturers={lecturers}
        selectedLecturer={selectedLecturer}
        setSelectedLecturer={setSelectedLecturer}
        currentSunday={currentSunday}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
        goToday={goToday}
      />
      <div className="form-container">
        <h2>{isEditing ? "Sửa lịch học" : "Thêm lịch học mới"}</h2>
        <form onSubmit={handleFormSubmit} className="form-grid">
          <div className="form-group">
            <label>Ngày học</label>
            <input
              type="date"
              name="study_date"
              value={formData.study_date}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Giờ bắt đầu */}
          <div className="form-group">
            <label>Giờ bắt đầu</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="form-input"
              step="60"
              required
            />
          </div>

          {/* Giờ kết thúc */}
          <div className="form-group">
            <label>Giờ kết thúc</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              className="form-input"
              step="60"
              required
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
              required
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  {r.room_name}
                </option>
              ))}
            </select>
          </div>

          {/* Học phần */}
          <div className="form-group">
            <label>Học phần</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">-- Chọn học phần --</option>
              {subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Giáo viên (lọc theo học phần) */}
          <div className="form-group">
            <label>Giáo viên</label>
            <select
              name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleInputChange}
              className="form-select"
              required
              disabled={!formData.subject_id}
            >
              <option value="">-- Chọn giáo viên --</option>
              {lecturersForSubject.map((lec) => (
                <option key={lec.lecturer_id} value={lec.lecturer_id}>
                  {lec.lecturer_name}
                </option>
              ))}
            </select>
          </div>

          {/* Lớp học (lọc theo học phần + giảng viên) */}
          <div className="form-group">
            <label>Lớp học</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="form-select"
              required
              disabled={!formData.lecturer_id}
            >
              <option value="">-- Chọn lớp --</option>
              {classesForSelection.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="button button-primary">
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="button button-secondary"
            >
              {isEditing ? "Hủy sửa" : "Xóa form"}
            </button>
          </div>
        </form>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ngày học</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Phòng</th>
              <th>Lớp</th>
              <th>Học phần</th>
              <th>Giáo viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-600">
                  Không có lịch nào.
                </td>
              </tr>
            ) : (
              schedules.map((row) => (
                <tr key={row.schedule_id} className="hover:bg-gray-100">
                  <td>
                    {new Date(row.study_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{row.start_time.slice(0, 5)}</td>
                  <td>{row.end_time.slice(0, 5)}</td>
                  <td>{row.room_name}</td>
                  <td>{row.class_name}</td>
                  <td>{row.subject_name}</td>
                  <td>{row.lecturer_name}</td>
                  <td className="text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="button button-warning"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row.schedule_id)}
                      className="button button-danger"
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
      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={confirmParams.title}
        message={confirmParams.message}
        onConfirm={confirmParams.onConfirm}
        onCancel={closeConfirm}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
