// src/controllers/attendanceController.js
const attendanceModel = require("../models/attendanceModel");
const db = require("../config/db");

exports.getAssignmentsForAttendance = async (req, res) => {
  try {
    const result = await attendanceModel.getAssignmentsForAttendance();
    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi lấy assignment điểm danh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.recordAttendance = async (req, res) => {
  const { assignment_id, absent_students } = req.body;

  if (!assignment_id || !Array.isArray(absent_students)) {
    return res.status(400).json({ message: "Thiếu dữ liệu điểm danh" });
  }

  try {
    const dataToInsert = absent_students.map((item) => ({
      assignment_id,
      student_id: item.student_id,
      absent_day: item.absent_day,
      total_day: item.total_day,
    }));

    await db("study_warnings").insert(dataToInsert);

    return res.status(200).json({ message: "Ghi điểm danh thành công" });
  } catch (err) {
    console.error("❌ Lỗi ghi điểm danh:", err);
    return res.status(500).json({ message: "Lỗi server khi ghi điểm danh" });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  const { assignment_id } = req.query;

  if (!assignment_id) {
    return res.status(400).json({ message: "Thiếu assignment_id" });
  }

  try {
    const rows = await db("study_warnings as w")
      .join("students as s", "w.student_id", "s.student_id")
      .select(
        "w.warning_id",
        "w.student_id",
        "s.student_name",
        "w.absent_day",
        "w.total_day",
        "w.created_at"
      )
      .where("w.assignment_id", assignment_id)
      .orderBy("w.created_at", "desc");

    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy lịch sử điểm danh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.deleteAttendance = async (req, res) => {
  const { warning_id } = req.params;
  try {
    await db("study_warnings").where({ warning_id }).del();
    res.json({ message: "Đã xoá bản ghi điểm danh" });
  } catch (err) {
    console.error("Lỗi xoá điểm danh:", err);
    res.status(500).json({ message: "Lỗi server khi xoá" });
  }
};

exports.updateAttendance = async (req, res) => {
  const { warning_id } = req.params;
  const { absent_day, total_day } = req.body;

  try {
    await db("study_warnings")
      .where({ warning_id })
      .update({ absent_day, total_day });
    res.json({ message: "Đã cập nhật bản ghi điểm danh" });
  } catch (err) {
    console.error("Lỗi cập nhật điểm danh:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
};
