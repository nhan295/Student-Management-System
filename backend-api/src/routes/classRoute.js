const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const db = require("../config/db");
router.get("/students-by-subject", classController.getStudentsBySubject);
router.put("/update-grade", classController.updateGrade);

module.exports = router;
