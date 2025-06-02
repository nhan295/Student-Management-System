const db = require('../config/db');

const assignmentModel = {
    assignLecturer: (lecturer_id,subject_id,class_id) =>{
        return db('assignment')
        .insert({
            lecturer_id: lecturer_id,
            subject_id: subject_id,
            class_id: class_id
        })
    },

    showAssigned: ()=>{
        return db('assignment')
        .select('class.class_name','courses.course_name','subjects.subject_name','lecturers.lecturer_name')
        .innerJoin('class','class.class_id','assignment.class_id')
        .innerJoin('subjects','subjects.subject_id','assignment.subject_id')
        .innerJoin('lecturers','lecturers.lecturer_id','assignment.lecturer_id')
        .innerJoin('courses','courses.course_id','class.course_id')
    }
}

module.exports = assignmentModel