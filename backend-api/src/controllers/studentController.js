const db = require('../config/db');
exports.getStudentById = (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM students WHERE student_id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy học viên' });
        }

        res.json(results[0]);
    });
};

exports.searchStudents = (req, res) => {
    const name = req.query.name || '';
    const query = `SELECT * FROM students WHERE student_name LIKE ?`;

    db.query(query, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn:', err);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        res.json(results); 
    });
};


exports.updateStudent = (req, res) => {
    const { id } = req.params;
    const { student_name, birthday } = req.body;

    const query = `UPDATE students SET student_name = ?, birthday = ? WHERE student_id = ?`;
    db.query(query, [student_name, birthday, id], (err, result) => {
        if (err) {
            console.error('Lỗi cập nhật:', err);
            return res.status(500).json({ error: 'Không thể cập nhật học viên' });
        }

        res.json({ message: 'Cập nhật thành công', result });
    });
};

exports.getStudentProgress = (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT
        s.subject_code,
        s.subject_name,
        sc.school_year,
        sc.group_name,
        sc.score
      FROM scores sc
      JOIN subjects s ON s.subject_id = sc.subject_id
      WHERE sc.student_id = ?
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn điểm:', err);
        return res.status(500).json({ error: 'Lỗi truy vấn' });
      }
      res.json(results);
    });
  };
  