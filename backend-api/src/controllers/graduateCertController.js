const GraduateCert = require("../models/graduateCertModel");

// Helper promisify
const toPromise = (fn) =>
  new Promise((resolve, reject) =>
    fn((err, results) => (err ? reject(err) : resolve(results)))
  );

// Lấy toàn bộ chứng chỉ tốt nghiệp
exports.getAll = async (req, res) => {
  try {
    const list = await toPromise((cb) => GraduateCert.getAll(cb));
    res.json(list);
  } catch (err) {
    console.error("Lỗi getAll graduate cert:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

exports.search = async (req, res) => {
  const { term } = req.params;
  try {
    const rows = await GraduateCert.searchByTerm(term);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy kết quả" });
    }
    res.json(rows);
  } catch (err) {
    console.error("Lỗi search bằng tốt nghiệp:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Thêm mới
exports.add = async (req, res) => {
  const data = req.body;
  try {
    const insertResult = await toPromise((cb) => GraduateCert.add(data, cb));
    // insertResult thường chứa [insertId]
    res
      .status(201)
      .json({ message: "Thêm thành công", certificateId: insertResult[0] });
  } catch (err) {
    console.error("Lỗi add graduate cert:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Cập nhật
exports.update = async (req, res) => {
  const { certificateId } = req.params;
  const data = req.body;
  try {
    const affectedRows = await toPromise((cb) =>
      GraduateCert.update(certificateId, data, cb)
    );
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chứng chỉ để cập nhật" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi update graduate cert:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Xóa
exports.delete = async (req, res) => {
  const { certificateId } = req.params;
  try {
    const affectedRows = await toPromise((cb) =>
      GraduateCert.delete(certificateId, cb)
    );
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chứng chỉ để xóa" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi delete graduate cert:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
