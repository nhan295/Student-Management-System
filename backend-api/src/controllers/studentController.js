const db = require('../config/db');
const StudentModel = require('../models/studentModel');

exports.getStudentById = async(req, res) => {
    const { student_id } = req.params; 
    try{
        const result = await StudentModel.getStudentById(student_id);
        if(result){
            res.json(result);
        }else{
            res.status(404).json({ message: 'Không tìm thấy học viên' });
        }
    }catch(err){
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};

exports.searchStudents = async(req, res) => {
    const name = req.params.student_name
    const data = await StudentModel.searchStudent(name);
    try{
        if(data){
        res.json(data);
    }
    else{
        res.status(404).json({ message: 'Không tìm thấy học viên' });
    }
    }catch(err){
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
    
};


exports.updateStudent = (req, res) => {
    const {student_id } = req.params;
    const { student_name, birthday } = req.body;
    try{
        if(!student_name || !birthday) {
            return res.status(400).json({ message: 'Thiếu thông tin cần cập nhật' });
        }
        const data = StudentModel.updateStudent(student_id, { student_name, birthday });
        if(data){
            res.json({ message: 'Cập nhật học viên thành công' });
        }else{
            res.status(404).json({ message: 'Không tìm thấy học viên để cập nhật' });
        }
    }catch(err){
        console.error('Lỗi cập nhật học viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }

};

// exports.getStudentProgress = (req, res) => {
//     const { id } = req.params;
  
//     const query = `
//       SELECT
//         s.subject_code,
//         s.subject_name,
//         sc.school_year,
//         sc.group_name,
//         sc.score
//       FROM scores sc
//       JOIN subjects s ON s.subject_id = sc.subject_id
//       WHERE sc.student_id = ?
//     `;
  
//     db.query(query, [id], (err, results) => {
//       if (err) {
//         console.error('Lỗi truy vấn điểm:', err);
//         return res.status(500).json({ error: 'Lỗi truy vấn' });
//       }
//       res.json(results);
//     });
//   };
  