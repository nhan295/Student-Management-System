const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
  const { subject_name, subject_code } = req.body;
  if (!subject_name || !subject_code) {
    return res
      .status(400)
      .json({ error: "Thiếu subject_name hoặc subject_code" });
  }
  try {
    await db("subjects").insert({ subject_name, subject_code });
    res.status(201).json({ message: "Thêm học phần thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
