const ProgressModel = require("../models/ProgressModel");

exports.getProgressByStudent = async (req, res) => {
  const { student_id } = req.params;
  const sid = parseInt(student_id, 10);

  if (isNaN(sid)) {
    return res.status(400).json({ message: "student_id không hợp lệ" });
  }

  try {
    // Gọi model
    const rows = await ProgressModel.getProgressByStudent(sid);
    return res.json({ student_id: sid, progress: rows });
  } catch (err) {
    console.error("Lỗi khi lấy tiến độ học tập:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.updateGrade = async (req, res) => {
  const { student_id, subject_id } = req.params;
  const sid = parseInt(student_id, 10);
  const subId = parseInt(subject_id, 10);
  const { grade } = req.body;

  if (isNaN(sid) || isNaN(subId)) {
    return res
      .status(400)
      .json({ message: "student_id hoặc subject_id không hợp lệ" });
  }
  if (typeof grade !== "number" || grade < 0 || grade > 10) {
    return res.status(400).json({ message: "grade phải là số từ 0 đến 10" });
  }

  try {
    await ProgressModel.upsertGrade(sid, subId, grade);
    return res.json({ message: "Cập nhật điểm thành công" });
  } catch (err) {
    console.error("Lỗi khi update grade:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
