import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/AttendancePage.css";
import ConfirmDialog from "../components/FormDialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("form");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [totalDay, setTotalDay] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  // // Load assignments and mark those already submitted
  // useEffect(() => {
  //   api.get("/api/v1/attendance/assignments").then(async (res) => {
  //     const data = res.data;
  //     const checked = await Promise.all(
  //       data.map(async (a) => {
  //         const r = await api.get("/api/v1/attendance/history", {
  //           params: { assignment_id: a.assignment_id },
  //         });
  //         return r.data.length > 0 ? a.assignment_id : null;
  //       })
  //     );
  //     setSubmittedAssignments(checked.filter(Boolean));
  //     setAssignments(data);
  //   });
  // }, []);
  // 1. Tách fetch assignments + đánh dấu đã submit thành hàm riêng
  const fetchAssignments = async () => {
    try {
      const { data } = await api.get("/api/v1/attendance/assignments");
      setAssignments(data);

      const checked = await Promise.all(
        data.map(async (a) => {
          const r = await api.get("/api/v1/attendance/history", {
            params: { assignment_id: a.assignment_id },
          });
          return r.data.length > 0 ? a.assignment_id : null;
        })
      );
      setSubmittedAssignments(checked.filter(Boolean));
    } catch {
      toast.error("❌ Lỗi tải assignments");
    }
  };

  // 2. Load lần đầu
  useEffect(() => {
    fetchAssignments();
  }, []);

  // Load students when in 'form' tab and an assignment is selected
  useEffect(() => {
    if (activeTab === "form" && selectedAssignment) {
      api
        .get("/api/v1/student", {
          params: {
            classId: selectedAssignment.class_id,
            courseId: selectedAssignment.course_id,
          },
        })
        .then((res) => {
          setStudents(res.data);
          const init = {};
          res.data.forEach((s) => {
            init[s.student_id] = "";
          });
          setAttendanceData(init);
        })
        .catch(() => {
          toast.error("❌ Lỗi tải danh sách học viên");
          setStudents([]);
        });
    } else {
      setStudents([]);
    }
  }, [activeTab, selectedAssignment]);

  // Load history when in 'history' tab and assignment selected
  useEffect(() => {
    if (activeTab === "history" && selectedAssignment) {
      api
        .get("/api/v1/attendance/history", {
          params: { assignment_id: selectedAssignment.assignment_id },
        })
        .then((res) => setHistory(res.data))
        .catch(() => {
          toast.error("❌ Lỗi tải lịch sử điểm danh");
          setHistory([]);
        });
    } else {
      setHistory([]);
    }
  }, [activeTab, selectedAssignment]);

  const handleAbsentChange = (studentId, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmAction(() => handleDelete);
    setShowConfirm(true);
  };

  const confirmAdd = () => {
    setConfirmAction(() => handleSubmitConfirmed);
    setShowConfirm(true);
  };

  const confirmUpdate = (id) => {
    setConfirmAction(() => () => handleUpdateConfirmed(id));
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) await confirmAction();
    setShowConfirm(false);
    setConfirmAction(null);
  };

  // const handleSubmitConfirmed = async () => {
  //   const absent_students = Object.entries(attendanceData)
  //     .filter(([, v]) => v && parseInt(v) > 0)
  //     .map(([student_id, absent_day]) => ({
  //       student_id: parseInt(student_id),
  //       absent_day: parseInt(absent_day),
  //       total_day: totalDay,
  //     }));

  //   if (!selectedAssignment || absent_students.length === 0) {
  //     toast.warn("⚠️ Hãy chọn học phần và nhập số ngày vắng.");
  //     return;
  //   }
  //   // Double-check not already submitted:
  //   const checkRes = await api.get("/api/v1/attendance/history", {
  //     params: { assignment_id: selectedAssignment.assignment_id },
  //   });
  //   if (checkRes.data.length > 0) {
  //     toast.warning(
  //       `⚠️ Lớp ${selectedAssignment.class_name} - ${selectedAssignment.subject_name} đã được điểm danh.`
  //     );
  //     return;
  //   }

  //   // Submit
  //   await api
  //     .post("/api/v1/attendance/add", {
  //       assignment_id: selectedAssignment.assignment_id,
  //       absent_students,
  //     })
  //     .then(() =>
  //       toast.success(
  //         `✔️ Đã lưu điểm danh cho ${absent_students.length} học viên.`
  //       )
  //     )
  //     .catch(() => toast.error("❌ Không thể lưu điểm danh."));
  //   setAttendanceData({});
  // };
  const handleSubmitConfirmed = async () => {
    const absent_students = Object.entries(attendanceData)
      .filter(([, v]) => v && parseInt(v) > 0)
      .map(([student_id, absent_day]) => ({
        student_id: parseInt(student_id),
        absent_day: parseInt(absent_day),
        total_day: totalDay,
      }));

    if (!selectedAssignment || absent_students.length === 0) {
      toast.warn("⚠️ Hãy chọn học phần và nhập số ngày vắng.");
      return;
    }

    // double-check
    const checkRes = await api.get("/api/v1/attendance/history", {
      params: { assignment_id: selectedAssignment.assignment_id },
    });
    if (checkRes.data.length > 0) {
      toast.warning(
        `⚠️ Lớp ${selectedAssignment.class_name} - ${selectedAssignment.subject_name} đã được điểm danh.`
      );
      return;
    }

    // Submit
    try {
      await api.post("/api/v1/attendance/add", {
        assignment_id: selectedAssignment.assignment_id,
        absent_students,
      });
      toast.success(
        `✔️ Đã lưu điểm danh cho ${absent_students.length} học viên.`
      );

      // 3. Refresh lại data
      await fetchAssignments();
      setSelectedAssignment(null);
      setAttendanceData({});
      setTotalDay(0);
    } catch {
      toast.error("❌ Không thể lưu điểm danh.");
    }
  };

  const handleUpdateConfirmed = async (warningId) => {
    await api
      .put(`/api/v1/attendance/update/${warningId}`, editingData)
      .then(() => {
        toast.success("✔️ Đã cập nhật điểm danh");
        setEditingId(null);
        // reload history
        return api.get("/api/v1/attendance/history", {
          params: { assignment_id: selectedAssignment.assignment_id },
        });
      })
      .then((res) => setHistory(res.data))
      .catch(() => toast.error("❌ Không thể cập nhật"));
  };

  const handleDelete = async () => {
    if (pendingDeleteId) {
      await api
        .delete(`/api/v1/attendance/delete/${pendingDeleteId}`)
        .then(() => toast.success("🗑️ Đã xoá bản ghi điểm danh"))
        .then(() =>
          api.get("/api/v1/attendance/history", {
            params: { assignment_id: selectedAssignment.assignment_id },
          })
        )
        .then((res) => setHistory(res.data))
        .catch(() => toast.error("❌ Không thể xoá"));
    }
    setPendingDeleteId(null);
  };

  return (
    <div className="attendance-page">
      <h2>📋 QUẢN LÝ ĐIỂM DANH</h2>

      <div className="tab-header">
        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => setActiveTab("form")}
        >
          NHẬP ĐIỂM DANH
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          DANH SÁCH ĐIỂM DANH
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "form" && (
          <>
            <div className="filters">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo môn học, lớp hoặc khóa"
                className="search-input"
              />
              <select
                value={selectedAssignment?.assignment_id || ""}
                onChange={(e) => {
                  const found = assignments.find(
                    (a) => a.assignment_id == e.target.value
                  );
                  setSelectedAssignment(found || null);
                  setAttendanceData({});
                }}
              >
                <option value="">Chọn học phần - lớp - khóa</option>
                {assignments
                  .filter((a) => {
                    const search = searchTerm.toLowerCase();
                    return (
                      (a.subject_name.toLowerCase().includes(search) ||
                        a.class_name.toLowerCase().includes(search) ||
                        a.course_name.toLowerCase().includes(search)) &&
                      !submittedAssignments.includes(a.assignment_id)
                    );
                  })
                  .map((a) => (
                    <option key={a.assignment_id} value={a.assignment_id}>
                      {a.subject_name} - {a.class_name} ({a.course_name})
                    </option>
                  ))}
              </select>
            </div>

            {selectedAssignment && students.length > 0 && (
              <>
                <div className="summary">
                  <p>
                    Tổng số buổi học:{" "}
                    <input
                      type="number"
                      value={totalDay}
                      onChange={(e) => setTotalDay(e.target.value)}
                      placeholder="Tổng số buổi học"
                    />
                  </p>
                </div>
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Mã HV</th>
                      <th>Học viên</th>
                      <th>Số ngày vắng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.student_id}>
                        <td>{s.student_id}</td>
                        <td>{s.student_name}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            value={attendanceData[s.student_id] || ""}
                            onChange={(e) =>
                              handleAbsentChange(s.student_id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="submit-btn" onClick={confirmAdd}>
                  Lưu điểm danh
                </button>
              </>
            )}
          </>
        )}

        {activeTab === "history" && (
          <div className="attendance-history">
            <div className="filters">
              <select
                onChange={(e) => {
                  const found = assignments.find(
                    (a) => a.assignment_id == e.target.value
                  );
                  setSelectedAssignment(found || null);
                }}
              >
                <option value="">Chọn học phần để xem lịch sử</option>
                {assignments
                  .filter((a) => submittedAssignments.includes(a.assignment_id))
                  .map((a) => (
                    <option key={a.assignment_id} value={a.assignment_id}>
                      {a.subject_name} - {a.class_name} ({a.course_name})
                    </option>
                  ))}
              </select>
            </div>

            {history.length > 0 ? (
              <table className="attendance-table history">
                <thead>
                  <tr>
                    <th>Mã HV</th>
                    <th>Họ tên</th>
                    <th>Số ngày vắng</th>
                    <th>Tổng buổi</th>
                    <th>Ngày ghi</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.warning_id}>
                      <td>{h.student_id}</td>
                      <td>{h.student_name}</td>
                      <td>
                        {editingId === h.warning_id ? (
                          <input
                            type="number"
                            value={editingData.absent_day}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                absent_day: e.target.value,
                              })
                            }
                            style={{ width: "50px" }}
                          />
                        ) : (
                          h.absent_day
                        )}
                      </td>
                      <td>
                        {editingId === h.warning_id ? (
                          <input
                            type="number"
                            value={editingData.total_day}
                            onChange={(e) =>
                              setEditingData({
                                ...editingData,
                                total_day: e.target.value,
                              })
                            }
                            style={{ width: "50px" }}
                          />
                        ) : (
                          h.total_day
                        )}
                      </td>
                      <td>
                        {new Date(h.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        {editingId === h.warning_id ? (
                          <button onClick={() => confirmUpdate(h.warning_id)}>
                            💾
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(h.warning_id);
                              setEditingData({
                                absent_day: h.absent_day,
                                total_day: h.total_day,
                              });
                            }}
                          >
                            ✏️
                          </button>
                        )}
                        <button onClick={() => confirmDelete(h.warning_id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>⚠️HÃY CHỌN HỌC PHẦN VÀ LỚP CÓ ĐIỂM DANH⚠️ </p>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Xác nhận thao tác"
        message="Bạn có chắc chắn muốn thực hiện thao tác này?"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
