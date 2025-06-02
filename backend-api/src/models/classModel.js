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
      );

    if (subjectName) {
      query.where("sub.subject_name", "like", `%${subjectName}%`);
    }

    if (classId) {
      query.andWhere("s.class_id", "like", `%${classId}%`);
    }

    return query;
  },

  updateGrade: async (studentId, subjectName, newGrade) => {
    try {
      // Tìm ID môn học từ tên môn
      const subject = await db("subjects")
        .select("subject_id")
        .where("subject_name", subjectName)
        .first();

      if (!subject) {
        throw new Error("Không tìm thấy môn học với tên đã cho");
      }

      // Kiểm tra nếu bản ghi đã tồn tại trong bảng exams
      const existingRecord = await db("exams")
        .where({
          student_id: studentId,
          subject_id: subject.subject_id,
        })
        .first();

      if (existingRecord) {
        // Nếu đã có, cập nhật điểm
        await db("exams")
          .where({
            student_id: studentId,
            subject_id: subject.subject_id,
          })
          .update({ grade: newGrade });
      } else {
        // Nếu chưa có, tạo bản ghi mới
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
};
