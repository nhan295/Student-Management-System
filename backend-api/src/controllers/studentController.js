const studentModel = require("../models/studentModel");
const db = require("../config/db");

exports.addStudent = async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      birthday,
      gender,
      party_join_date,
      professional_level,
      title,
      agency_name,
      plan_title,
      barcode,
      course_id,
      class_id,
    } = req.body;

    await db("students").insert({
      student_id,
      student_name,
      birthday,
      gender,
      party_join_date,
      professional_level,
      title,
      agency_name,
      plan_title,
      barcode,
      course_id,
      class_id,
    });

    res.status(200).json({ message: "Thêm sinh viên thành công" });
  } catch (err) {
    console.error("🔥 Lỗi thêm sinh viên:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  const { classId, courseId } = req.query;
  try {
    const students = await studentModel.getStudentsByClassAndCourse(
      classId,
      courseId
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  const courses = await studentModel.getCourses();
  res.json(courses);
};

exports.getClass = async (req, res) => {
  const Class = await studentModel.getClasses();
  res.json(Class);
};
exports.addCourse = async (req, res) => {
  try {
    const { course_name, start_year, end_year } = req.body;

    const [course_id] = await db("courses").insert({
      course_name,
      start_year,
      end_year,
    });

    res.status(201).json({ message: "Thêm khóa học thành công", course_id });
  } catch (err) {
    console.error("🔥 Lỗi thêm khóa học:", err);
    res.status(500).json({ error: err.message });
  }
};

const db = require("../config/db");
const StudentModel = require("../models/studentModel");

exports.getStudentById = async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await StudentModel.getStudentById(student_id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Không tìm thấy học viên" });
    }
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

exports.searchStudents = async (req, res) => {
  const name = req.params.student_name;
  const data = await StudentModel.searchStudent(name);
  try {
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Không tìm thấy học viên" });
    }
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

exports.updateStudent = async (req, res) => {
  const { student_id } = req.params;
  const {
    student_name,
    birthday,
    agency_name,
    class_id,
    course_id,
    professional_level,
    party_join_date,
    plan_title,
  } = req.body;
  try {
    // Gọi model update và chờ kết quả
    const count = await StudentModel.updateStudent(student_id, {
      student_name,
      birthday,
      agency_name,
      class_id,
      course_id,
      professional_level,
      party_join_date,
      plan_title,
    });
    if (count > 0) {
      // Lấy lại thông tin mới nhất để trả về cho FE
      const updated = await StudentModel.getStudentById(student_id);
      res.json(updated);
    } else {
      res.status(404).json({ message: "Không tìm thấy học viên để cập nhật" });
    }
  } catch (err) {
    console.error("Lỗi cập nhật học viên:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// exports.getStudentProgress = (req, res) => {
//     const { id } = req.params;

//     const query = `
//       SELECT
//         s.subject_code,
//         s.subject_name,
//         sc.school_year,
//         sc.group_name,
//         sc.score
//       FROM scores sc
//       JOIN subjects s ON s.subject_id = sc.subject_id
//       WHERE sc.student_id = ?
//     `;

//     db.query(query, [id], (err, results) => {
//       if (err) {
//         console.error('Lỗi truy vấn điểm:', err);
//         return res.status(500).json({ error: 'Lỗi truy vấn' });
//       }
//       res.json(results);
//     });
//   };
