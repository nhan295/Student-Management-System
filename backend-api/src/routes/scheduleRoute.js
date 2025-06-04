// /backend/routes/scheduleRoute.js
const express = require("express");
const router = express.Router();
const {
  getFullSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

// GET all schedule assignments
// → GET /api/v1/schedules
router.get("/", getFullSchedule);

// POST create a new schedule assignment
// → POST /api/v1/schedules
router.post("/", createSchedule);

// PUT update existing schedule assignment by assignment_id
// → PUT /api/v1/schedules/:assignmentId
router.put("/:assignmentId", updateSchedule);

// DELETE schedule assignment by assignment_id
// → DELETE /api/v1/schedules/:assignmentId
router.delete("/:assignmentId", deleteSchedule);

module.exports = router;
