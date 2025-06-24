const db = require("../config/db"); // là Knex instance (db.js)

const ProgressModel = {
  /**
   * Lấy tiến độ học tập của học viên (student_id).
   * Join giữa bảng exams (e) và subjects (s) để lấy mã môn + tên môn.
   * Trả về mảng:
   *   [
   *     {
   *       subject_id,
   *       subject_code,
   *       subject_name,
   *       grade       // điểm
   *     },
   *     ...
   *   ]
   */
  getProgressByStudent: async (student_id) => {
    return await db("exams as e")
      .join("subjects as s", "e.subject_id", "s.subject_id")
      .select("s.subject_id", "s.subject_code", "s.subject_name", "e.grade")
      .where("e.student_id", student_id);
  },

  /**
   * Cập nhật hoặc chèn mới điểm (grade) cho một cặp (student_id, subject_id).
   * Nếu đã tồn tại bản ghi (exam) với student_id + subject_id, ta update grade.
   * Nếu chưa tồn tại, ta insert mới.
   *
   * Lưu ý: bảng exams đã có:
   *   exam_id (PK), grade, subject_id, student_id, exSchedule_id.
   * Do exSchedule_id không cần thiết lúc nhập điểm, ta chỉ xử lý 2 cột chính.
   */
  upsertGrade: async (student_id, subject_id, newGrade) => {
    // Tìm xem có bản ghi hiện tại hay chưa
    const existing = await db("exams")
      .where({ student_id, subject_id })
      .first();

    if (existing) {
      // Nếu đã có, update grade
      return await db("exams")
        .where({ student_id, subject_id })
        .update({ grade: newGrade });
    } else {
      // Nếu chưa có, insert mới (exSchedule_id ta để null)
      return await db("exams").insert({
        student_id,
        subject_id,
        grade: newGrade,
        exSchedule_id: null, // hoặc 0
      });
    }
  },
};

module.exports = ProgressModel;
