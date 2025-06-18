const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

router.get("/students-by-subject", classController.getStudentsBySubject);
router.get("/all-classes", classController.getAllClasses);
router.get("/all-subjects", classController.getAllSubjects);
router.get("/export-to-excel", classController.exportToExcel);
router.post("/", classController.addClass);
router.put("/update-grade", classController.updateGrade);
router.get("/:id/students", classController.getStudentsByClassId);

module.exports = router;
