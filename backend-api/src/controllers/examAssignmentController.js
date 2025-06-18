const examAssignmentModel = require('../models/examAssignmentModel');

const getAllAssignment = async (req, res) => {
    try{
        const { subject_id, class_id } = req.query; 
         if (!subject_id || !class_id) {
            return res.status(400).json({ message: 'Thiếu môn học hoặc lớp' });
        }
        const data = await examAssignmentModel.getAllAssignment(subject_id,class_id);
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
};

const createExamAssignment = async(req,res) =>{
    const {exam_format,assignment_id} = req.body;
    try{
    if (!exam_format){
        return res.status(400).json({message: 'Bạn cần nhập đủ trường'})
    }
    await examAssignmentModel.createExamAssignment(exam_format,assignment_id)
    return res.status(200).json({message: 'Đã thêm mới nội dung thi'})
}   catch(err){
    console.error(err)
    return res.status(500).json({message: 'Lỗi server'})
}
};

const editExamAssignment = async(req,res) =>{
    const {exSchedule_id} = req.params
    const {exam_format} = req.body
    try{
        const result = await examAssignmentModel.editExamAssignment(exSchedule_id,exam_format)
        if(result){
            return res.status(200).json({message: 'Cập nhật thành công'})
        }else{
            return res.status(400).json({message: 'Cập nhật không thành công'})
        }
    }catch(err){
        console.error(err)
        return res.status(500).json({message: 'Lỗi server'})
    }
}

const delExamAssignment = async(req,res) =>{
    const {exSchedule_id} = req.params
    try{
        const result = await examAssignmentModel.delExamAssignment(exSchedule_id)
        if(result){
            return res.status(200).json({message: 'Đã xoá nội dung thi'})
        }
        else{
            return res.status(400).json({message: 'Lỗi khi xoá'})
        }
    }catch(err){
        return res.status(500).json({message: 'Lỗi server'})
    }
}
module.exports = {
    getAllAssignment,
    createExamAssignment,
    editExamAssignment,
    delExamAssignment
}