// coursesRoute.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getAllCourses);
router.post("/", courseController.addCourse);

module.exports = router;
