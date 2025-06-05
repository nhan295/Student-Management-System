const db = require("../config/db");

module.exports = {
  getStudentsByFilters: (subjectName, classId) => {
    const query = db("students as s")
      .join("exams as e", "e.student_id", "s.student_id")
      .join("subjects as sub", "e.subject_id", "sub.subject_id")
      .select(
        "s.student_id",
        "s.student_name",
        "s.class_id",
        "sub.subject_name",
        "e.grade"
      ); // <-- sửa dấu phẩy thành dấu chấm phẩy

    if (subjectName) {
      query.where("sub.subject_name", "like", `%${subjectName}%`);
    }

    if (classId) {
      query.andWhere("s.class_id", classId);
    }

    return query;
  },

  updateGrade: async (studentId, subjectName, newGrade) => {
    try {
      const subject = await db("subjects")
        .select("subject_id")
        .where("subject_name", subjectName)
        .first();

      if (!subject) {
        throw new Error("Không tìm thấy môn học với tên đã cho");
      }

      const existingRecord = await db("exams")
        .where({
          student_id: studentId,
          subject_id: subject.subject_id,
        })
        .first();

      if (existingRecord) {
        await db("exams")
          .where({
            student_id: studentId,
            subject_id: subject.subject_id,
          })
          .update({ grade: newGrade });
      } else {
        await db("exams").insert({
          student_id: studentId,
          subject_id: subject.subject_id,
          grade: newGrade,
        });
      }
    } catch (error) {
      console.error("Lỗi trong updateGrade:", error);
      throw error;
    }
  },

  getAllClasses: async () => {
    return await db("Class as c")
      .join("courses as co", "c.course_id", "co.course_id")
      .select("c.class_id", "c.class_name", "co.course_name");
  },
};
