const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

router.get("/students-by-subject", classController.getStudentsBySubject);
router.get("/classlist",classController.getClassList);


module.exports = router;
