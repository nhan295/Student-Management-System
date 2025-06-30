const db = require("../config/db");

const assignmentModel = {
  // assignLecturer: (lecturer_id, subject_id, class_id) => {
  //   return db("assignment").insert({
  //     lecturer_id: lecturer_id,
  //     subject_id: subject_id,
  //     class_id: class_id,
  //   });
  // },

  assignLecturer: async (lecturer_id, subject_id, class_id) => {
    const existing = await db("assignment")
      .where({ subject_id, class_id })
      .first();
    // Kiểm tra xem đã có phân công nào cho môn học và lớp này chưa
    if (existing) {
      return db("assignment")
        .where({ assignment_id: existing.assignment_id })
        .update({
          lecturer_id,
          is_active: true,
        });
    }
    // Nếu chưa có, thì tạo mới
    return db("assignment").insert({
      lecturer_id,
      subject_id,
      class_id,
      is_active: true,
    });
  },

  // showAssigned: () => {
  //   return db("assignment")
  //     .select(
  //       "class.class_name",
  //       "courses.course_name",
  //       "subjects.subject_name",
  //       "lecturers.lecturer_name",
  //       "lecturers.lecturer_id",
  //       "assignment.assignment_id"
  //     )
  //     .innerJoin("class", "class.class_id", "assignment.class_id")
  //     .innerJoin("subjects", "subjects.subject_id", "assignment.subject_id")
  //     .innerJoin("lecturers", "lecturers.lecturer_id", "assignment.lecturer_id")
  //     .innerJoin("courses", "courses.course_id", "class.course_id");
  // },
  showAssigned: () => {
    return db("assignment")
      .select(
        "class.class_name",
        "courses.course_name",
        "subjects.subject_name",
        "lecturers.lecturer_name",
        "lecturers.lecturer_id",
        "assignment.assignment_id"
      )
      .innerJoin("class", "class.class_id", "assignment.class_id")
      .innerJoin("subjects", "subjects.subject_id", "assignment.subject_id")
      .innerJoin("lecturers", "lecturers.lecturer_id", "assignment.lecturer_id")
      .innerJoin("courses", "courses.course_id", "class.course_id")
      .where("assignment.is_active", true); // Hiện các cặp môn-gv đang đc phân công
  },


  delAssign: (assignment_id) => {
    return db("assignment")
      .where({ assignment_id })
      .del();
     
  },

  editAssign: (assignment_id, lecturer_id, subject_id, class_id) => {
    return db("assignment").where({ assignment_id: assignment_id }).update({
      lecturer_id: lecturer_id,
      subject_id: subject_id,
      class_id: class_id,
    });
  },


  getSubject: () => {
  return db("assignment")
    .distinct("subjects.subject_id", "subjects.subject_name")
    .join("subjects", "subjects.subject_id", "assignment.subject_id");
},


  getClassBySubject: (subject_id) => {
    return db("assignment")
      .select("class.class_id", "class.class_name", "courses.course_name")
      .join("class", "class.class_id", "assignment.class_id")
      .join("courses", "courses.course_id", "class.course_id")
      .where("assignment.subject_id", subject_id);
  },

  getAssignId: (subject_id, class_id) => {
    return db("assignment").select("assignment.assignment_id").where({
      subject_id: subject_id,
      class_id: class_id,
    });
  },
};

module.exports = assignmentModel;
