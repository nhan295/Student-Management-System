<<<<<<< HEAD
const db = require("../config/db");

exports.addStudent = async (student) => {
  const [result] = await db.execute(
    `INSERT INTO students 
    (student_id, student_name, birthday, gender, party_join_date, professional_level, title, agency_name, plan_title, barcode, course_id, class_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      student.student_id,
      student.student_name,
      student.birthday,
      student.gender,
      student.party_join_date,
      student.professional_level,
      student.title,
      student.agency_name,
      student.plan_title,
      student.barcode,
      student.course_id,
      student.class_id,
    ]
  );
  return result;
};

exports.getStudentsByClassAndCourse = async (classId, courseId) => {
  const rows = await db("students")
    .select("*")
    .where({ class_id: classId, course_id: courseId });
  return rows;
};

exports.getCourses = async () => {
  const rows = await db("courses").select("*");
  return rows;
};

exports.getClasses = async () => {
  const rows = await db("class").select("*");
  return rows;
};
=======
const db = require('../config/db');

const StudentModel = {
  // 🔍 Tìm kiếm học viên theo từ khóa
  searchStudent: async (student_name) => {
  return await db('students')
    .leftJoin('class', 'students.class_id', 'class.class_id')
    .leftJoin('courses', 'students.course_id', 'courses.course_id')
    .where('students.student_name', 'like', `%${student_name}%`)
    .select(
      'students.student_id',
      'students.student_name'
    );
},

  // ✏️ Cập nhật học viên theo ID
  updateStudent: async (student_id, data) => {
    return await db('students')
      .where({ student_id: student_id })
      .update(data);
  },

  // 📄 Lấy thông tin chi tiết của học viên theo ID
  getStudentById: async (student_id) => {
    return await db('students')
      .select("student_id", 
        "student_name", 
        "birthday",
        "class.class_name",
        "courses.course_name",
        "gender", 
        "agency_name",
        "party_join_date",
        "professional_level",
        "plan_title",
        "barcode")
      .join('class', 'students.class_id','class.class_id')
      .join('courses', 'students.course_id', 'courses.course_id')
      .where({ student_id: student_id })
      .first();
  }
};

module.exports = StudentModel;
>>>>>>> dd5fe0cb2d30bd39d9bed714cfbd14eeeac9a9b7
