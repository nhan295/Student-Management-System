const assignmentController = require('../controllers/assignmentController');
const express = require('express');
const router = express.Router();

module.exports.setup = (app) =>{
    app.use('/api/v1/assignment',router)

    router.post('/add',assignmentController.assignLecturer)
    router.get('/',assignmentController.showAssigned)
}