// src/routes/attendanceRoute.js
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.get("/assignments", attendanceController.getAssignmentsForAttendance);

router.post("/add", attendanceController.recordAttendance);

router.get("/history", attendanceController.getAttendanceHistory);

router.delete("/delete/:warning_id", attendanceController.deleteAttendance);

router.put("/update/:warning_id", attendanceController.updateAttendance);
module.exports = router;
