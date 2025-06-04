const db = require('../config/db');

const StudentModel = {
  // 🔍 Tìm kiếm học viên theo từ khóa
  search: async (keyword) => {
    return await db('students')
      .leftJoin('class', 'students.class_id', 'class.class_id')
      .leftJoin('courses', 'students.course_id', 'courses.course_id')
      .where('student_name', 'like', `%${keyword}%`)
      .orWhere('student_id', 'like', `%${keyword}%`)
      .orWhere('class.class_name', 'like', `%${keyword}%`)
      .select(
        'student_id',
        'student_name',
        'gender',
        'birthday',
        'professional_level',
        'title',
        'class.class_name',
        'courses.course_name'
      );
  },

  // ✏️ Cập nhật học viên theo ID
  update: async (id, data) => {
    return await db('students')
      .where({ student_id: id })
      .update(data);
  },

  // 📄 Lấy thông tin chi tiết của học viên theo ID
  getById: async (id) => {
    return await db('students')
      .where({ student_id: id })
      .first();
  }
};

module.exports = StudentModel;
