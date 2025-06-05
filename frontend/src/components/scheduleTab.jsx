/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import WeeklyTimeline from "./WeeklyTimeline";
import "../styles/schedule.css";

export default function ScheduleTab() {
  // ─── State chính ───
  const [schedules, setSchedules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [currentSunday, setCurrentSunday] = useState(
    (() => {
      const today = new Date();
      const day = today.getDay();
      const diff = day === 0 ? 0 : -day;
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + diff);
      sunday.setHours(0, 0, 0, 0);
      return sunday;
    })()
  );
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

  // ─── 1. Fetch lookups khi mount ───
  useEffect(() => {
    async function fetchLookups() {
      try {
        const [lecRes, roomRes, classRes, subRes, assignRes] =
          await Promise.all([
            axios.get("http://localhost:3000/api/v1/lookups/lecturers"),
            axios.get("http://localhost:3000/api/v1/lookups/rooms"),
            axios.get("http://localhost:3000/api/v1/lookups/classes"),
            axios.get("http://localhost:3000/api/v1/lookups/subjects"),
            axios.get("http://localhost:3000/api/v1/lookups/assignments"),
          ]);

        if (lecRes.data.success) setLecturers(lecRes.data.data);
        if (roomRes.data.success) setRooms(roomRes.data.data);
        if (classRes.data.success) setClasses(classRes.data.data);
        if (subRes.data.success) setSubjects(subRes.data.data);
        if (assignRes.data.success) setAssignments(assignRes.data.data);
      } catch (err) {
        console.error("Error fetching lookups:", err);
        setError("Lỗi khi tải dữ liệu lookup.");
      }
    }
    fetchLookups();
  }, []);

  // ─── 2. Fetch schedules mỗi khi currentSunday hoặc selectedLecturer thay đổi ───
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

      try {
        let url = `http://localhost:3000/api/v1/schedules?startDate=${startDate}&endDate=${endDate}`;
        if (selectedLecturer) {
          url += `&lecturer_id=${selectedLecturer}`;
        }

        const res = await axios.get(url);
        if (res.data.success) {
          setSchedules(res.data.data);
        } else {
          setError("Không tải được lịch.");
        }
      } catch (err) {
        console.error("Fetch schedules error:", err);
        setError("Lỗi khi tải lịch.");
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

  // ─── 4. Hàm lọc dropdown theo subject → lecturer → class ───
  const lecturersForSubject = React.useMemo(() => {
    if (!formData.subject_id) return [];
    const filtered = assignments.filter(
      (a) => String(a.subject_id) === formData.subject_id
    );
    const unique = [];
    const seen = new Set();
    for (let a of filtered) {
      if (!seen.has(a.lecturer_id)) {
        seen.add(a.lecturer_id);
        unique.push({
          lecturer_id: a.lecturer_id,
          lecturer_name: a.lecturer_name,
        });
      }
    }
    return unique;
  }, [assignments, formData.subject_id]);

  const classesForSelection = React.useMemo(() => {
    if (!formData.subject_id || !formData.lecturer_id) return [];
    const filtered = assignments.filter(
      (a) =>
        String(a.subject_id) === formData.subject_id &&
        String(a.lecturer_id) === formData.lecturer_id
    );
    const unique = [];
    const seen = new Set();
    for (let a of filtered) {
      if (!seen.has(a.class_id)) {
        seen.add(a.class_id);
        unique.push({
          class_id: a.class_id,
          class_name: a.class_name,
        });
      }
    }
    return unique;
  }, [assignments, formData.subject_id, formData.lecturer_id]);

  // ─── 5. Hàm chuyển đổi "HH:MM" → tổng số phút ───
  const parseTimeToMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(":").map((x) => parseInt(x, 10));
    return hh * 60 + mm;
  };

  // ─── 6. Chuyển ISO string (UTC) → ngày "YYYY-MM-DD" theo múi giờ local ───
  const toLocalDateString = (isoDateString) => {
    const d = new Date(isoDateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // ─── 7. Xử lý thay đổi form ───
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "subject_id") {
        return {
          ...prev,
          subject_id: value,
          lecturer_id: "",
          class_id: "",
        };
      }
      if (name === "lecturer_id") {
        return {
          ...prev,
          lecturer_id: value,
          class_id: "",
        };
      }
      return {
        ...prev,
        [name]: value,
      };
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

  // ─── 8. Tải lại schedules của một ngày (cho việc check xung đột) ───
  const fetchSchedulesOfDay = async (dateString) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/schedules?study_date=${dateString}`
      );
      if (res.data.success) {
        return res.data.data;
      } else {
        return [];
      }
    } catch (err) {
      console.error("Lỗi khi fetch schedules của ngày:", err);
      return [];
    }
  };

  // ─── 9. Xử lý lưu (thêm / cập nhật) kèm check xung đột ───
  const handleSave = async (e) => {
    e.preventDefault();
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

    // 9.1. Kiểm tra nhập đủ
    if (
      !study_date ||
      !start_time ||
      !end_time ||
      !room_id ||
      !subject_id ||
      !lecturer_id ||
      !class_id
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // 9.2. Chuyển thời gian sang phút
    const newStart = parseTimeToMinutes(start_time);
    const newEnd = parseTimeToMinutes(end_time);
    if (newEnd <= newStart) {
      alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return;
    }

    // 9.3. Tìm assignment_id tương ứng (môn–giáo viên–lớp)
    const foundAssignment = assignments.find(
      (a) =>
        String(a.subject_id) === subject_id &&
        String(a.lecturer_id) === lecturer_id &&
        String(a.class_id) === class_id
    );
    if (!foundAssignment) {
      alert("Cặp (Môn – Giáo viên – Lớp) không tồn tại.");
      return;
    }

    // 9.4. Gọi API lấy lại danh sách schedules của ngày đó (cập nhật nhất)
    const schedulesOfDay = await fetchSchedulesOfDay(study_date);

    // 9.5. Kiểm tra xung đột (chỉ trong schedulesOfDay)
    for (let row of schedulesOfDay) {
      // 9.5.1. Nếu đang chỉnh sửa, bỏ qua chính bản ghi đó
      if (isEditing && row.schedule_id === schedule_id) {
        continue;
      }

      // 9.5.2. Lấy ngày của row theo local VN rồi so sánh với formData.study_date
      const rowLocalDate = toLocalDateString(row.study_date);
      if (rowLocalDate !== study_date) {
        continue;
      }

      // 9.5.3. Ép kiểu để so sánh giáo viên và lớp
      const exLecturerId = Number(row.lecturer_id);
      const exClassId = Number(row.class_id);
      const newLecturerId = Number(lecturer_id);
      const newClassId = Number(class_id);

      if (exLecturerId === newLecturerId || exClassId === newClassId) {
        const existingStart = parseTimeToMinutes(row.start_time.slice(0, 5));
        const existingEnd = parseTimeToMinutes(row.end_time.slice(0, 5));
        // 9.5.4. Kiểm tra overlap: [newStart, newEnd) giao với [existingStart, existingEnd)
        if (newStart < existingEnd && newEnd > existingStart) {
          const conflictReason =
            exClassId === newClassId ? "Lớp này" : "Giáo viên này";
          alert(
            `Xung đột lịch: ${conflictReason} đã có lịch trùng khung giờ.\n` +
              `Lịch cũ (ID: ${row.schedule_id}) → ${row.start_time.slice(
                0,
                5
              )} - ${row.end_time.slice(0, 5)}\n\n` +
              `Vui lòng đổi khung giờ khác.`
          );
          return; // Dừng luôn, không cho lưu
        }
      }
    }

    // 9.6. Nếu không xung đột → chuẩn bị payload và gọi API thêm/ cập nhật
    const payload = {
      study_date,
      start_time,
      end_time,
      room_id: parseInt(room_id, 10),
      exSchedule_id: null,
      assignment_id: foundAssignment.assignment_id,
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

      // 9.7. Sau khi lưu xong, gọi lại fetch tuần hiện tại để cập nhật state schedules
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 0 : -dayOfWeek;
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + diff);
      sunday.setHours(0, 0, 0, 0);
      setCurrentSunday(sunday);

      // 9.8. Reset form
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu lên server:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // ─── 10. Chỉnh sửa khi bấm "Sửa" ───
  const handleEditClick = (row) => {
    setFormData({
      schedule_id: row.schedule_id,
      study_date: row.study_date.slice(0, 10), // ISO → "YYYY-MM-DD"
      start_time: row.start_time ? row.start_time.slice(0, 5) : "",
      end_time: row.end_time ? row.end_time.slice(0, 5) : "",
      room_id: String(row.room_id),
      subject_id: String(row.subject_id),
      lecturer_id: String(row.lecturer_id),
      class_id: String(row.class_id),
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── 11. Xóa lịch ───
  const handleDeleteClick = async (scheduleIdToDelete) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/schedules/${scheduleIdToDelete}`
      );
      alert("Xóa thành công.");
      // Reload lại tuần hiện tại
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 0 : -dayOfWeek;
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + diff);
      sunday.setHours(0, 0, 0, 0);
      setCurrentSunday(sunday);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Lỗi khi xóa.");
    }
  };

  // ─── Loading / Error ───
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

  // ─── Render chính ───
  return (
    <div>
      {/* ==== 1) Weekly Timeline ==== */}
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

      {/* ==== 2) Form Thêm / Cập nhật ==== */}
      <div className="form-container">
        <h2 className="form-title">
          {isEditing ? "Sửa lịch học" : "Thêm lịch học mới"}
        </h2>
        <form onSubmit={handleSave} className="form-grid">
          {/* Ngày học */}
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

          {/* Môn học */}
          <div className="form-group">
            <label>Môn học</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">-- Chọn môn --</option>
              {subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Giáo viên (lọc theo môn) */}
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

          {/* Lớp học (lọc theo môn + giáo viên) */}
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

          {/* Nút lưu / hủy */}
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

      {/* ==== 3) Bảng Hiển thị Lịch ==== */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Ngày học</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Phòng</th>
              <th>Lớp</th>
              <th>Môn học</th>
              <th>Giáo viên</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-gray-600 text-center">
                  Không có lịch nào.
                </td>
              </tr>
            ) : (
              schedules.map((row) => (
                <tr key={row.schedule_id} className="hover:bg-gray-100">
                  <td>
                    {new Date(row.study_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td>{row.start_time?.slice(0, 5)}</td>
                  <td>{row.end_time?.slice(0, 5)}</td>
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
    </div>
  );
}
