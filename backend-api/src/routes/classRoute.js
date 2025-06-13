const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

const db = require("../config/db");

router.get("/students-by-subject", classController.getStudentsBySubject);
router.put("/update-grade", classController.updateGrade);
router.get("/all-classes", classController.getAllClasses);
router.get("/export-to-excel", classController.exportToExcel);
// Ví dụ: routes/classRoutes.js
router.post("/classes", async (req, res) => {
  const { class_name, course_id } = req.body;
  try {
    await db("Class").insert({ class_name, course_id });
    res.status(201).json({ message: "Lớp học đã được thêm" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi thêm lớp học" });
  }
});

module.exports = router;
