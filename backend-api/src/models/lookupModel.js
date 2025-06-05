// backend/models/lookupModel.js
const db = require("../config/db");

const lookupModel = {
  getRooms: () => {
    return db("room").select("room_id", "room_name");
  },
  getClasses: () => {
    return db("Class").select("class_id", "class_name");
  },
  getSubjects: () => {
    return db("subjects").select("subject_id", "subject_name");
  },
  getLecturers: () => {
    return db("lecturers").select("lecturer_id", "lecturer_name");
  },

  // ────────────────────────────────────────────────
  // Thêm hàm này để lấy data "assignment"
  getAssignments: () => {
    // Join bảng assignment với Class, subjects, và lecturers
    return db("assignment as a")
      .join("Class      as c", "a.class_id", "c.class_id")
      .join("subjects   as sub", "a.subject_id", "sub.subject_id")
      .join("lecturers  as lec", "a.lecturer_id", "lec.lecturer_id")
      .select(
        "a.id as assignment_id",
        "c.class_id",
        "c.class_name",
        "sub.subject_id",
        "sub.subject_name",
        "lec.lecturer_id",
        "lec.lecturer_name"
      )
      .orderBy("c.class_name", "asc")
      .orderBy("sub.subject_name", "asc")
      .orderBy("lec.lecturer_name", "asc");
  },
  // ────────────────────────────────────────────────
};

module.exports = lookupModel;
