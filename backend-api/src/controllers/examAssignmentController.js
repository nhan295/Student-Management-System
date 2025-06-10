const examAssignmentModel = require('../models/examAssignmentModel');

const getAllAssignment = async (req, res) => {
    try{
        const data = await examAssignmentModel.getAllAssignment();
        if(data){
            return res.status(200).json(data);
        }
        else{
            console.error("Không tìm thấy bảng phân công :", response.error);
            return res.status(400).json({message: 'Không tìm thấy bảng phân công'});
        }
    }catch(err){
        console.error("Lỗi khi lấy danh sách phân công thi:", err);
        return res.status(500).json({message: 'Lỗi server'});
    }
}

module.exports = {
    getAllAssignment
}