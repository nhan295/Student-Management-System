const ClassModel = require("../models/classModel");

const getStudentsBySubject = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Thiếu tên môn học." });

    const students = await ClassModel.getStudentsBySubjectName(name);
    res.json(students);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

module.exports = {
  getStudentsBySubject,
};
