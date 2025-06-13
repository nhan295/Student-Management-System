const express = require("express");
const router = express.Router();
const graduateCertController = require("../controllers/graduateCertController");

router.get("/student/:studentId", graduateCertController.getByStudentId);


module.exports = router;
