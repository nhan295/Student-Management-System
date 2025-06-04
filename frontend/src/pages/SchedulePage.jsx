import React, { useState, useEffect } from "react";
import axios from "axios";

function TeacherAssignmentTab() {
  //  hoặc đưa form tạo “assignment” mới vào đây…

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ví dụ fetch danh sách assignment (giảng viên–môn–lớp)
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
      <div className="text-gray-600 text-center p-4">
        Đang tải phân công giảng viên…
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Danh sách phân công Giảng viên
      </h3>
      <table className="min-w-full table-auto bg-white shadow rounded-md overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Giảng viên</th>
            <th className="px-4 py-2 text-left">Môn học</th>
            <th className="px-4 py-2 text-left">Lớp học</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-600">
                Chưa có phân công nào.
              </td>
            </tr>
          ) : (
            assignments.map((item) => (
              <tr key={item.assignment_id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{item.lecturer_name}</td>
                <td className="border px-4 py-2">{item.subject_name}</td>
                <td className="border px-4 py-2">{item.class_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Nếu bạn cần form thêm/cập nhật phân công mới, có thể đặt vào đây */}
      {/* Ví dụ placeholder: */}
      <div className="mt-6 p-4 border border-gray-300 rounded">
        <p className="text-gray-600">
          [Placeholder: Form thêm/cập nhật phân công giảng viên sẽ nằm ở đây]
        </p>
      </div>
    </div>
  );
}

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

  // ─────────── Render ───────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600">Đang tải dữ liệu…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* FORM Thêm / Cập nhật Lịch học */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isEditing ? "Sửa lịch học" : "Thêm lịch học mới"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Ngày học */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Ngày học
            </label>
            <input
              type="date"
              name="study_date"
              value={formData.study_date}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
            />
          </div>
          {/* Phòng học */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phòng học
            </label>
            <select
              name="room_id"
              value={formData.room_id}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Môn học
            </label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Giáo viên
            </label>
            <select
              name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Lớp học
            </label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
            >
              <option value="">-- Chọn lớp --</option>
              {classOptions().map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút Add/Update & Cancel */}
          <div className="col-span-2 flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
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
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded"
            >
              {isEditing ? "Hủy sửa" : "Xóa form"}
            </button>
          </div>
        </form>
      </div>

      {/* BẢNG HIỂN THỊ SCHEDULE */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Ngày học</th>
              <th className="px-4 py-2 text-left">Phòng</th>
              <th className="px-4 py-2 text-left">Lớp</th>
              <th className="px-4 py-2 text-left">Môn học</th>
              <th className="px-4 py-2 text-left">Giáo viên</th>
              <th className="px-4 py-2 text-left">Chú thích</th>
              <th className="px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-600">
                  Không có lịch nào.
                </td>
              </tr>
            ) : (
              schedules.map((row) => (
                <tr key={row.schedule_id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">
                    {new Date(row.study_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="border px-4 py-2">{row.room_name}</td>
                  <td className="border px-4 py-2">{row.class_name}</td>
                  <td className="border px-4 py-2">{row.subject_name}</td>
                  <td className="border px-4 py-2">{row.lecturer_name}</td>
                  <td className="border px-4 py-2">
                    {row.exam_format
                      ? `${row.exam_format} (${new Date(
                          row.exam_date_es
                        ).toLocaleDateString("vi-VN")})`
                      : ""}
                  </td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row.schedule_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ─────────── Thanh tab ─────────── */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 border-2 border-black max-w-2xl w-full">
          {/*Tab 1: Phân công Giảng viên */}
          <button
            onClick={() => setActiveTab("assignment")}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-full transition-colors
              ${
                activeTab === "assignment"
                  ? "bg-purple-700"
                  : "bg-white bg-opacity-30 hover:bg-opacity-50"
              }
            `}
          >
            <span className="mr-2">👩‍🏫</span>
            <span>Phân công Giảng viên</span>
          </button>
          {/* Tab 2: Sắp lịch Học */}
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-full transition-colors
              ${
                activeTab === "schedule"
                  ? "bg-purple-700"
                  : "bg-white bg-opacity-30 hover:bg-opacity-50"
              }
            `}
          >
            <span className="mr-2">🗓️</span>
            <span>Sắp lịch Học</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {activeTab === "assignment" && <TeacherAssignmentTab />}
        {activeTab === "schedule" && <ScheduleTab />}
      </div>
    </div>
  );
}
