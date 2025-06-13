const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Các route gọi đến controller
router.post("/", studentController.addStudent);
router.get("/", studentController.getStudents);
router.get("/courses", studentController.getCourses);
router.get("/class", studentController.getClass);

module.exports = router;

module.exports.setup = (app) => {
  app.use("/api/v1/student", router);
  // router.get("/search/:student_name", studentController.searchStudents);
  router.get("/search", studentController.searchStudents);
  router.get("/:student_id", studentController.getStudentById);
  router.put("/edit/:student_id", studentController.updateStudent);
};
