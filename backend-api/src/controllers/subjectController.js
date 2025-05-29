const subjectModel = require("../models/subjectModel");

exports.getAllSubjects = async (req, res) => {
  try {
    const list = await subjectModel.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await subjectModel.getById(id);
    if (!item)
      return res.status(404).json({ error: "Không tìm thấy học phần" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubject = async (req, res) => {
  const { subject_name, subject_code } = req.body;
  if (!subject_name || !subject_code) {
    return res.status(400).json({ error: "Thiếu tên hoặc mã học phần" });
  }
  try {
    await subjectModel.create({ subject_name, subject_code });
    res.status(201).json({ message: "Thêm học phần thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subject_name, subject_code } = req.body;
  try {
    const count = await subjectModel.updateById(id, {
      subject_name,
      subject_code,
    });
    if (count === 0)
      return res.status(404).json({ error: "Không tìm thấy học phần" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await subjectModel.deleteById(id);
    if (count === 0)
      return res.status(404).json({ error: "Không tìm thấy học phần" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
