const db = require('../config/db')

const lectureModel = {

    getLecture: ()=>{
        return db('lecturers')
        .select('lecturer_name')
    }
}

module.exports = lectureModel