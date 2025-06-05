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
        "agencies.agency_name",
        "party_join_date",
        "professional_level",
        "plan_title",
        "barcode")
      .join('class', 'students.class_id','class.class_id')
      .join('courses', 'students.course_id', 'courses.course_id')
      .join('agencies', 'students.agency_id', 'agencies.agency_id')
      .where({ student_id: student_id })
      .first();
  }
};

module.exports = StudentModel;
