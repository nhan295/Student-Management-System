const classModel = require("../models/classModel");

exports.getStudentsBySubject = async (req, res) => {
  const { name, classId } = req.query;
  try {
    const students = await classModel.getStudentsByFilters(name, classId);
    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sinh viên:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy danh sách sinh viên." });
  }
};

exports.updateGrade = async (req, res) => {
  const { studentId, subjectName, newGrade } = req.body;
  try {
    await classModel.updateGrade(studentId, subjectName, newGrade);
    res.json({ message: "Cập nhật điểm thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật điểm:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật điểm." });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await classModel.getAllClasses();
    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp:", error);
    res.status(500).json({ error: "Không thể lấy danh sách lớp." });
  }
};
