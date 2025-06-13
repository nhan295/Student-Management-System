const express = require("express");
const router = express.Router();
const {
  getRooms,
  getClasses,
  getSubjects,
  getLecturers,
  getAssignments,
} = require("../controllers/lookupController");

router.get("/rooms", getRooms);
router.get("/classes", getClasses);
router.get("/subjects", getSubjects);
router.get("/lecturers", getLecturers);
router.get("/assignments", getAssignments);

module.exports = router;
