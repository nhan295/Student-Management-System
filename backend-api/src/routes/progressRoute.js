const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

module.exports.setup = (app) => {
  // Tương tự studentRoute.setup(app)
  app.use("/api/v1/progress", router);

  // GET  /api/v1/progress/:student_id
  router.get("/:student_id", progressController.getProgressByStudent);

  // PUT  /api/v1/progress/:student_id/:subject_id
  router.put("/:student_id/:subject_id", progressController.updateGrade);
};
