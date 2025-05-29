const express = require("express");
const router = express.Router();
const Subject = require("../models/subjectModel");

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.getAll();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new subject
router.post("/", async (req, res) => {
  const { subject_name, subject_code } = req.body;
  if (!subject_name || !subject_code) {
    return res
      .status(400)
      .json({ error: "Thiếu subject_name hoặc subject_code" });
  }
  try {
    await Subject.create({ subject_name, subject_code });
    res.status(201).json({ message: "Thêm học phần thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update subject
router.put("/:subject_id", async (req, res) => {
  const { subject_name, subject_code } = req.body;
  const { subject_id } = req.params;
  try {
    const updated = await Subject.updateById(subject_id, {
      subject_name,
      subject_code,
    });
    if (updated === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy học phần để cập nhật" });
    }
    res.json({ message: "Cập nhật học phần thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE subject
router.delete("/:subject_id", async (req, res) => {
  const { subject_id } = req.params;
  try {
    const deleted = await Subject.deleteById(subject_id);
    if (deleted === 0) {
      return res.status(404).json({ error: "Không tìm thấy học phần để xóa" });
    }
    res.json({ message: "Xóa học phần thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
