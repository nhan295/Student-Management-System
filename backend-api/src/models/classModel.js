const db = require("../config/db");

module.exports = {
  getStudentsBySubjectName: (subjectName) =>
    db("students as s")
      .join("exams as e", "e.student_id", "s.student_id")
      .join("subjects as sub", "e.subject_id", "sub.subject_id")
      .select(
        "s.student_id",
        "s.student_name",
        "s.class_id",
        "sub.subject_name",
        "e.grade"
      )
      .where("sub.subject_name", "like", `%${subjectName}%`),
};
