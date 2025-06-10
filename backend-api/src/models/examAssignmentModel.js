const db = require('../config/db');

const examAssignmentModel = {

    getAllAssignment: ()=>{
        return db('exam_schedule')
        .select('subjects.subject_name','class.class_name','courses.course_name','exam_schedule.exam_format')
        .join('assignment','assignment.assignment_id','exam_schedule.assignment_id')
        .join('class','class.class_id','assignment.class_id')
        .join('subjects','subjects.subject_id','assignment.subject_id')
        .join('courses','courses.course_id','class.course_id')
    },

    createExamAssignment: (exam_format,class_id,subject_id)=>{
        return db('exam_schedule')
        .insert({
            exam_format: exam_format,
            class_id: class_id,
            subject_id: subject_id
        });
    }


}

module.exports = examAssignmentModel;