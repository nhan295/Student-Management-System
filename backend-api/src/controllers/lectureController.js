const lectureModel = require('../models/lectureModel');

const getAllLecture = async(req,res) =>{
    try{
        const lectureList = await lectureModel.getLecture()
        if(lectureList){
            res.json( lectureList)
        }
        else{
            res.status(400).json({message: 'Không tìm thấy giảng viên'})
        }
    }catch(err){
        res.status(500).json({message: 'Lỗi server'})
    }

}

module.exports = {
    getAllLecture
}