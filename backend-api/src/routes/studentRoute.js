const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

module.exports.setup = (app) => {
    app.use('/api/v1/students', router);
    router.get('/search', studentController.searchStudents);
    router.get('/:id', studentController.getStudentById);
    router.put('/edit/:id', studentController.updateStudent);

}