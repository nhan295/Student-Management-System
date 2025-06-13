const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/graduateCertController");

router.get("/student/:student_id", certificateController.getByStudentId);

module.exports = router;