const assignmentController = require('../controllers/assignmentController');
const express = require('express');
const router = express.Router();

module.exports.setup = (app) =>{
    app.use('/api/v1/assignment',router)

    router.post('/add',assignmentController.assignLecturer)
    router.get('/',assignmentController.showAssigned)
    router.delete('/delete/:assignment_id',assignmentController.delAssign)
    router.put('/edit/:assignment_id',assignmentController.editAssign)
    router.get('/subjects',assignmentController.getSubject)
    router.get('/class/:subject_id', assignmentController.getClassBySubject);
    router.get('/getid',assignmentController.getAssignId)
}