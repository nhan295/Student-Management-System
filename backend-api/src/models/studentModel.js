const db = require("../config/db");

const StudentModel = {
  // ➕ Thêm học viên mới
  addStudent: async (student) => {
    const [result] = await db.execute(
      `INSERT INTO students 
      (student_id, student_name, birthday, gender, party_join_date, education_level, professional_level, title, agency_name, plan_title, barcode, course_id, class_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.student_id,
        student.student_name,
        student.birthday,
        student.gender,
        student.party_join_date,
        student.education_level,
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
  },

  // 📋 Lấy học viên theo lớp và khóa
  getStudentsByClassAndCourse: async (classId, courseId) => {
    const rows = await db("students")
      .select(
        "student_id",
        "student_name",
        "birthday",
        "gender",
        "party_join_date",
        "education_level",
        "professional_level",
        "title",
        "agency_name",
        "plan_title",
        "barcode",
        "course_id",
        "class_id"
      )

      .where({ class_id: classId, course_id: courseId });
    return rows;
  },

  // 📚 Lấy danh sách khóa học
  getCourses: async () => {
    const rows = await db("courses").select("*");
    return rows;
  },

  // 🏫 Lấy danh sách lớp học
  getClasses: async () => {
    const rows = await db("class").select("*");
    return rows;
  },

  // // 🔍 Tìm kiếm học viên theo tên
  // searchStudent: async (student_name) => {
  //   return await db("students")
  //     .leftJoin("class", "students.class_id", "class.class_id")
  //     .leftJoin("courses", "students.course_id", "courses.course_id")
  //     .where("students.student_name", "like", `%${student_name}%`)
  //     .select("students.student_id", "students.student_name");
  // },
  // models/studentModel.js
  searchStudent: async (term) => {
    return db("students")
      .leftJoin("class", "students.class_id", "class.class_id")
      .leftJoin("courses", "students.course_id", "courses.course_id")
      .select("students.student_id", "students.student_name")
      .where(function () {
        this.where("students.student_name", "like", `%${term}%`).orWhere(
          "students.student_id",
          "like",
          `%${term}%`
        );
      });
  },

  // ✏️ Cập nhật học viên theo ID
  updateStudent: async (student_id, data) => {
    return await db("students").where({ student_id: student_id }).update(data);
  },

  // 📄 Lấy thông tin học viên theo ID
  getStudentById: async (student_id) => {
    return await db("students")
      .select("*")
      .join("class", "students.class_id", "class.class_id")
      .join("courses", "students.course_id", "courses.course_id")
      .where({ student_id: student_id })
      .first();
  },
};

module.exports = StudentModel;
