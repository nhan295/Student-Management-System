// src/models/attendanceModel.js
const db = require("../config/db");

const attendanceModel = {
  getAssignmentsForAttendance: () => {
    return db("assignment")
      .select(
        "assignment.assignment_id",
        "assignment.class_id",
        "class.class_name",
        "class.course_id",
        "courses.course_name",
        "subjects.subject_id",
        "subjects.subject_name"
      )
      .innerJoin("class", "class.class_id", "assignment.class_id")
      .innerJoin("subjects", "subjects.subject_id", "assignment.subject_id")
      .innerJoin("courses", "courses.course_id", "class.course_id")
      .where("assignment.is_active", true);
  },
};

module.exports = attendanceModel;
