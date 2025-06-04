const express = require("express");
const router = express.Router();
const {
  getFullSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.get("/", getFullSchedule);

router.post("/", createSchedule);

router.put("/:scheduleId", updateSchedule);

router.delete("/:scheduleId", deleteSchedule);

module.exports = router;
