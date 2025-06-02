const classModel = require("../models/classModel");
const ClassModel = require("../models/classModel");

const getStudentsBySubject = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Thiếu tên môn học." });

    const students = await ClassModel.getStudentsBySubjectName(name);
    res.json(students);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

const getClassList = async(req,res) =>{
  try{
    const data = await classModel.getClassList();
    if(data){
      res.json({message: data});
    }else{
      return res.status(400).json({message: 'Không tìm thấy lớp'})

    }
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Lỗi server'})
  }
}

module.exports = {
  getStudentsBySubject,
  getClassList
};
