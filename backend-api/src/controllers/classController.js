const classModel = require("../models/classModel");
const ClassModel = require("../models/classModel");
const db = require("../config/db");
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

const ExcelJS = require("exceljs");

exports.exportToExcel = async (req, res) => {
  const { name, classId } = req.query;

  try {
    const students = await ClassModel.getStudentsByFilters(name, classId);

    if (!students.length) {
      return res.status(404).json({ error: "Không tìm thấy dữ liệu phù hợp." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng điểm");

    // 👉 Tiêu đề chính
    worksheet.mergeCells("A1:E1");
    worksheet.getCell(
      "A1"
    ).value = `BẢNG ĐIỂM MÔN: ${students[0].subject_name} - LỚP: ${students[0].class_id}`;
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getCell("A1").font = { size: 14, bold: true };

    // 👉 Dòng tiêu đề cột (dòng 2)
    worksheet.addRow([
      "Mã sinh viên",
      "Tên sinh viên",
      "Mã lớp",
      "Tên môn học",
      "Điểm",
    ]);

    // 👉 Dữ liệu (từ dòng 3 trở đi)
    students.forEach((student) => {
      worksheet.addRow([
        student.student_id,
        student.student_name,
        student.class_id,
        student.subject_name,
        student.grade,
      ]);
    });

    // 👉 Căn chỉnh độ rộng cột
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
    const safeName = String(name || "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeClassId = String(classId || "").replace(/[^a-zA-Z0-9_-]/g, "_");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Diem_${safeName}_${safeClassId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error);
    res.status(500).json({ error: "Không thể xuất file Excel." });
  }
};

// Thêm lớp học mới
exports.addClass = async (req, res) => {
  try {
    const { class_id, class_name, course_id, total_student } = req.body;

    if (!class_id || !class_name || !course_id || !total_student) {
      return res.status(400).json({ message: "Thiếu thông tin lớp học." });
    }

    const newClass = await db("classes").insert({
      class_id,
      class_name,
      course_id,
      total_student,
    });

    res.status(201).json({
      message: "Lớp học đã được thêm thành công.",
      data: newClass,
    });
  } catch (error) {
    console.error("Lỗi khi thêm lớp học:", error);
    res.status(500).json({ message: "Lỗi khi thêm lớp học.", error });
  }
};
