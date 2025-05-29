const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/subjectController");

// GET    /api/v1/subjects
router.get("/", ctrl.getAllSubjects);
// GET    /api/v1/subjects/:id
router.get("/:id", ctrl.getSubjectById);
// POST   /api/v1/subjects
router.post("/", ctrl.createSubject);
// PUT    /api/v1/subjects/:id
router.put("/:id", ctrl.updateSubject);
// DELETE /api/v1/subjects/:id
router.delete("/:id", ctrl.deleteSubject);

module.exports = router;
