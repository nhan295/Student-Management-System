const db = require('../config/db')

const lectureModel = {

    getLecture: ()=>{
        return db('lecturers')
        .select('*')
    }
}

module.exports = lectureModel