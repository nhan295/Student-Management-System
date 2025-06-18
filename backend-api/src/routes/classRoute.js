const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

const db = require("../config/db");

router.get("/students-by-subject", classController.getStudentsBySubject);

router.get("/all-classes", classController.getAllClasses);
router.get("/export-to-excel", classController.exportToExcel);
router.post("/classes", classController.addClass);
router.post("/update-grade", classController.updateGrade);
router.get("/:id/students", classController.getStudentsByClassId);

module.exports = router;
