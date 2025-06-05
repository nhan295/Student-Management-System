const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

module.exports.setup = (app) => {
    app.use('/api/v1/student', router);
    router.get('/search/:student_name', studentController.searchStudents);
    router.get('/:student_id', studentController.getStudentById);
    router.put('/edit/:student_id', studentController.updateStudent);
}