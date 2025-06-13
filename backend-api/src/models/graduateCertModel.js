// src/models/graduateCertModel.js
const db = require('../config/db');

const GraduateCert = {
  getAll: async (callback) => {
    try {
      const result = await db('graduation_certificates as gc')
        .leftJoin('students as s', 'gc.student_id', 's.student_id')
        .select('gc.*', 's.student_name');
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  getByStudentId: async (studentId, callback) => {
    console.log(">>> studentId received in model:", studentId); // thêm dòng này
  
    try {
      const result = await db('graduation_certificates as gc')
        .leftJoin('students as s', 'gc.student_id', 's.student_id')
        .select('gc.*', 's.student_name')
        .where('gc.student_id', studentId);
      callback(null, result[0]);
    } catch (err) {
      callback(err, null);
    }
  },
  

  add: async (data, callback) => {
    try {
      const result = await db('graduation_certificates').insert({
        student_id: data.student_id,
        certificate_number: data.certificate_number,
        issue_date: data.issue_date,
        is_issued: data.is_issued,
      });
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  update: async (certificateId, data, callback) => {
    try {
      const result = await db('graduation_certificates')
        .where('certificate_id', certificateId)
        .update({
          student_id: data.student_id,
          certificate_number: data.certificate_number,
          issue_date: data.issue_date,
          is_issued: data.is_issued,
        });
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  delete: async (certificateId, callback) => {
    try {
      const result = await db('graduation_certificates')
        .where('certificate_id', certificateId)
        .del();
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  }
};

module.exports = GraduateCert;

