const db = require('../config/db');

const examAssignmentModel = {

    getAllAssignment: (subject_id,class_id)=>{
        return db('exam_schedule')
        .select('exam_schedule.exSchedule_id','subjects.subject_name','class.class_name','class.class_id','courses.course_name','exam_schedule.exam_format')
        .join('assignment','assignment.assignment_id','exam_schedule.assignment_id')
        .join('class','class.class_id','assignment.class_id')
        .join('subjects','subjects.subject_id','assignment.subject_id')
        .join('courses','courses.course_id','class.course_id')
        .where('subjects.subject_id',subject_id)
        .where('class.class_id',class_id)
    },

    
    createExamAssignment: (exam_format,assignment_id)=>{
        return db('exam_schedule')
        .insert({
            exam_format: exam_format,
            assignment_id: assignment_id
        })
    },

    editExamAssignment: (exSchedule_id, exam_format) =>{
        return db('exam_schedule')
        .update({exam_format: exam_format})
        .where({exSchedule_id: exSchedule_id})
    }

}

module.exports = examAssignmentModel;