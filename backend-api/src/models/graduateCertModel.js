// src/models/graduateCertModel.js
const db = require('../config/db');

const GraduateCert = {
  getAll: (callback) => {
    const query = `
      SELECT gc.*, s.student_name 
      FROM graduation_certificates gc 
      LEFT JOIN students s ON gc.student_id = s.student_id
    `;
    db.query(query, callback);
  },

  getByStudentId: (studentId, callback) => {
    const query = `
      SELECT gc.*, s.student_name 
      FROM graduation_certificates gc 
      LEFT JOIN students s ON gc.student_id = s.student_id
      WHERE gc.student_id = ?
    `;
    db.query(query, [studentId], callback);
  },

  add: (data, callback) => {
    const query = `
      INSERT INTO graduation_certificates 
      (student_id, certificate_number, issue_date, is_issued)
      VALUES (?, ?, ?, ?)
    `;
    const values = [data.student_id, data.certificate_number, data.issue_date, data.is_issued];
    db.query(query, values, callback);
  },

  update: (certificateId, data, callback) => {
    const query = `
      UPDATE graduation_certificates 
      SET student_id = ?, certificate_number = ?, issue_date = ?, is_issued = ?
      WHERE certificate_id = ?
    `;
    const values = [data.student_id, data.certificate_number, data.issue_date, data.is_issued, certificateId];
    db.query(query, values, callback);
  },

  delete: (certificateId, callback) => {
    const query = `DELETE FROM graduation_certificates WHERE certificate_id = ?`;
    db.query(query, [certificateId], callback);
  }
};

module.exports = GraduateCert;
