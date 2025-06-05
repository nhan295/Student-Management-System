// backend/routes/lookupRoute.js
const express = require("express");
const router = express.Router();
const {
  getRooms,
  getClasses,
  getSubjects,
  getLecturers,
  getAssignments, // import thêm
} = require("../controllers/lookupController");

// Hiện có sẵn:
router.get("/rooms", getRooms);
router.get("/classes", getClasses);
router.get("/subjects", getSubjects);
router.get("/lecturers", getLecturers);
router.get("/assignments", getAssignments);

module.exports = router;
