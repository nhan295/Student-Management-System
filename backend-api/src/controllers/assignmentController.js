const { del } = require('../config/db');
const assignmentModel = require('../models/assignmentModel');

const assignLecturer = async(req,res) =>{
    const {lecturer_id,subject_id,class_id} = req.body
    try{
        if(!lecturer_id || !subject_id || !class_id){
            return res.status(400).json({message: 'Bạn nhập thiếu trường'})
        }
        await assignmentModel.assignLecturer(lecturer_id,subject_id,class_id)
        return res.status(200).json({message: 'Đã thêm vào phân công'})

    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Lỗi server'})
    }
}

const showAssigned = async(req,res) =>{
    try{
        const result = await assignmentModel.showAssigned();
        if(result){
            return res.status(200).json(result)
        }
        else{
            return res.status(400).json({message: 'Không tìm thấy bảng phân công'})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Lỗi server'})
    }
}

const delAssign = async(req,res) =>{
    const {assignment_id} = req.params
    try{
        const result = await assignmentModel.delAssign(assignment_id);
        if(result){
            return res.status(200).json({message:'Đã xóa phân công'})
    }
    }catch(err){
        return res.status(500).json({})
    }
}

const editAssign = async(req,res) =>{
    const {assignment_id} = req.params;
    const {lecturer_id,subject_id,class_id} = req.body;
    try{
        if(!lecturer_id || !subject_id || !class_id){
            return res.status(400).json({message: 'Bạn nhập thiếu trường'})
        }
        const result = await assignmentModel.editAssign(assignment_id,lecturer_id,subject_id,class_id);
        if(result){
            return res.status(200).json({message: 'Đã cập nhật phân công'})
        }
        else{
            return res.status(400).json({message: 'Không tìm thấy phân công để cập nhật'})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Lỗi server'})
    }



}
module.exports = {
    assignLecturer,
    showAssigned,
    delAssign,
    editAssign

}