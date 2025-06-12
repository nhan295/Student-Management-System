const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/warningController");

router.get("/", ctrl.getAllWarnings);

router.get("/class/:classId", ctrl.getWarningsByClass);

router.get("/subject/:subjectId", ctrl.getWarningsBySubject);

router.get("/classes-subjects", ctrl.getClassSubjectWithWarnings);

router.get(
  "/class/:classId/subject/:subjectId",
  ctrl.getWarningsByClassSubject
);

module.exports = router;
