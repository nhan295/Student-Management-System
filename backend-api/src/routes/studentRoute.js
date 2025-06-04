const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/search', studentController.searchStudents);
router.get('/:id', studentController.getStudentById);

router.put('/:id', studentController.updateStudent);

module.exports = router; 