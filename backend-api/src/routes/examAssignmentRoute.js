const express =  require('express');
const router = express.Router();
const examAssignmentController = require('../controllers/examAssignmentController');

module.exports.setup = (app)=>{
    app.use('/api/v1/exam-assignment', router);

    router.get('/', examAssignmentController.getAllAssignment);
    router.post('/add',examAssignmentController.createExamAssignment);
    router.put('/edit/:exSchedule_id',examAssignmentController.editExamAssignment);
    router.delete('delete/:exSchedule_id', examAssignmentController.delExamAssignment)
}   