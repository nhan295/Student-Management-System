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
