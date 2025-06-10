const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Các route gọi đến controller
router.post("/", studentController.addStudent);
router.get("/", studentController.getStudents);
router.get("/courses", studentController.getCourses);
router.get("/class", studentController.getClass);

module.exports = router;
