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
