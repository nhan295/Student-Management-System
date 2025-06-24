const db = require("../config/db");

module.exports = {
  // Lấy danh sách tất cả học phần
  getAll: () =>
    db("subjects").select(
      "subject_id",
      "subject_name",
      "subject_code",
      "total_lessons"
    ),

  // Lấy một học phần theo ID
  getById: (id) => db("subjects").where({ subject_id: id }).first(),

  // Tạo mới học phần
  create: (data) => db("subjects").insert(data),

  // Cập nhật học phần theo ID
  updateById: (id, data) =>
    db("subjects").where({ subject_id: id }).update(data),

  // Xóa học phần theo ID
  deleteById: (id) => db("subjects").where({ subject_id: id }).del(),
};
