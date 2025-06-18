// src/models/classModel.js
const db = require("../config/db");

module.exports = {
  getStudentsByFilters: (subjectName, classId) => {
    const query = db("students as s")
      .leftJoin("exams as e", "e.student_id", "s.student_id")
      .leftJoin("subjects as sub", "e.subject_id", "sub.subject_id")
      .select(
        "s.student_id",
        "s.student_name",
        "s.class_id",
        "sub.subject_name",
        "e.grade"
      );

    if (subjectName) {
      query.where("sub.subject_name", "like", `%${subjectName}%`);
    }

    if (classId) {
      query.andWhere("s.class_id", classId);
    }

    return query;
  },

  getAllClasses: async () => {
    return await db("class as c")
      .join("courses as co", "c.course_id", "co.course_id")
      .select("c.class_id", "c.class_name", "co.course_name", "c.course_id");
  },

  findGradeRecord: async (studentId, subjectId) => {
    return await db("exams")
      .where({ student_id: studentId, subject_id: subjectId })
      .first();
  },

  insertGrade: async (studentId, subjectId, grade) => {
    await db("exams").insert({
      student_id: studentId,
      subject_id: subjectId,
      grade: grade,
    });
  },

  updateGrade: async (studentId, subjectId, grade) => {
    await db("exams")
      .where({ student_id: studentId, subject_id: subjectId })
      .update({ grade: grade });
  },

  getStudentsByClassId: async (classId) => {
    return await db("students")
      .select("student_id", "student_name")
      .where("class_id", classId);
  },

  addClass: async (classData) => {
    await db("class").insert(classData);
  },
};
