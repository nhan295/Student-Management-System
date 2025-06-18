// src/controllers/classController.js
const classModel = require("../models/classModel");
const db = require("../config/db");
const ExcelJS = require("exceljs");

const getStudentsBySubject = async (req, res) => {
  const { subjectName, classId } = req.query;

  try {
    const students = await classModel.getStudentsByFilters(
      subjectName,
      classId
    );
    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sinh viên:", error);
    res
      .status(500)
      .json({ error: "Đã xảy ra lỗi khi lấy danh sách sinh viên." });
  }
};

const updateGrade = async (req, res) => {
  const { studentId, subjectName, newGrade } = req.body;

  if (!studentId || !subjectName || newGrade === undefined) {
    return res.status(400).json({ error: "Thiếu dữ liệu để cập nhật điểm." });
  }

  try {
    const subject = await db("subjects")
      .where({ subject_name: subjectName })
      .first();

    if (!subject) {
      return res.status(404).json({ error: "Không tìm thấy môn học." });
    }

    const subjectId = subject.subject_id;

    const existing = await classModel.findGradeRecord(studentId, subjectId);
    if (existing) {
      await classModel.updateGrade(studentId, subjectId, newGrade);
    } else {
      await classModel.insertGrade(studentId, subjectId, newGrade);
    }

    res.json({ message: "Cập nhật điểm thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật điểm:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi cập nhật điểm." });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await classModel.getAllClasses();
    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp:", error);
    res.status(500).json({ error: "Không thể lấy danh sách lớp." });
  }
};

const exportToExcel = async (req, res) => {
  const { name, classId } = req.query;

  try {
    const students = await classModel.getStudentsByFilters(name, classId);

    if (!students.length) {
      return res.status(404).json({ error: "Không tìm thấy dữ liệu phù hợp." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng điểm");

    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = `BẢNG ĐIỂM MÔN: ${
      students[0].subject_name || ""
    } - LỚP: ${students[0].class_id}`;
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getCell("A1").font = { size: 14, bold: true };

    worksheet.addRow([
      "Mã sinh viên",
      "Tên sinh viên",
      "Mã lớp",
      "Tên môn học",
      "Điểm",
    ]);

    students.forEach((student) => {
      worksheet.addRow([
        student.student_id,
        student.student_name,
        student.class_id,
        student.subject_name,
        student.grade,
      ]);
    });

    worksheet.columns = [
      { width: 15 },
      { width: 25 },
      { width: 10 },
      { width: 25 },
      { width: 10 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Diem_${name || "mon"}_${classId || "lop"}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error);
    res.status(500).json({ error: "Không thể xuất file Excel." });
  }
};

const addClass = async (req, res) => {
  const { class_id, class_name, course_id, total_student } = req.body;

  if (!class_id || !class_name || !course_id || !total_student) {
    return res
      .status(400)
      .json({ error: "Vui lòng nhập đầy đủ thông tin lớp học." });
  }

  try {
    await classModel.addClass({
      class_id: Number(class_id),
      class_name,
      course_id: Number(course_id),
      total_student: Number(total_student),
    });

    return res.status(201).json({ message: "Thêm lớp học thành công." });
  } catch (error) {
    console.error("Lỗi khi thêm lớp học:", error);
    return res.status(500).json({ error: error.sqlMessage || "Lỗi máy chủ." });
  }
};

const getStudentsByClassId = async (req, res) => {
  const classId = req.params.id;

  try {
    const students = await classModel.getStudentsByClassId(classId);
    res.json(students);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sinh viên:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = {
  getStudentsBySubject,
  updateGrade,
  getAllClasses,
  exportToExcel,
  addClass,
  getStudentsByClassId,
};
