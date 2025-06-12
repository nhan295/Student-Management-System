// src/models/warningModel.js
const db = require("../config/db");

module.exports = {
  // 1. Lấy tất cả cảnh báo
  getAll: () =>
    db("study_warnings").select(
      "warning_id",
      "student_id",
      "absent_day",
      "total_day",
      "assignment_id",
      "created_at"
    ),

  // 2. Lấy cảnh báo theo class: join với assignment để filter class_id
  getByClass: (classId) =>
    db("study_warnings as w")
      .join("assignment as a", "w.assignment_id", "a.assignment_id")
      .where("a.class_id", classId)
      .select(
        "w.warning_id",
        "w.student_id",
        "w.absent_day",
        "w.total_day",
        "w.assignment_id",
        "w.created_at"
      ),

  // 3. Lấy cảnh báo theo subject: join với assignment để filter subject_id
  getBySubject: (subjectId) =>
    db("study_warnings as w")
      .join("assignment as a", "w.assignment_id", "a.assignment_id")
      .where("a.subject_id", subjectId)
      .select(
        "w.warning_id",
        "w.student_id",
        "w.absent_day",
        "w.total_day",
        "w.assignment_id",
        "w.created_at"
      ),

  getClassSubjectWithWarnings: () =>
    db("study_warnings as w")
      .join("assignment as a", "w.assignment_id", "a.assignment_id")
      .join("class as c", "a.class_id", "c.class_id")
      .join("subjects as s", "a.subject_id", "s.subject_id")
      .distinct("c.class_id", "c.class_name", "s.subject_id", "s.subject_name")
      .orderBy("c.class_name", "asc")
      .orderBy("s.subject_name", "asc"),

  getByClassSubject: (classId, subjectId) =>
    db("study_warnings as w")
      .join("assignment as a", "w.assignment_id", "a.assignment_id")
      .join("students as s", "w.student_id", "s.student_id")
      .join("class as c", "a.class_id", "c.class_id")
      .join("subjects as sub", "a.subject_id", "sub.subject_id")
      .where("a.class_id", classId)
      .andWhere("a.subject_id", subjectId)
      .select(
        "w.warning_id",
        "w.student_id",
        "s.student_name",
        "c.class_id",
        "c.class_name",
        "sub.subject_id",
        "sub.subject_name",
        "w.absent_day",
        "w.total_day",
        "w.created_at"
      ),
};
