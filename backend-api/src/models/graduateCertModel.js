// src/models/graduateCertModel.js
const db = require("../config/db");

const GraduateCert = {
  getAll: async (callback) => {
    try {
      const result = await db("graduation_certificates as gc")
        .leftJoin("students as s", "gc.student_id", "s.student_id")
        .select("gc.*", "s.student_name");
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  searchByTerm: async (term) => {
    return db("graduation_certificates as gc")
      .join("students as s", "gc.student_id", "s.student_id")
      .select(
        "gc.certificate_id",
        "gc.certificate_number",
        "gc.issue_date",
        "gc.is_issued",
        "gc.student_id",
        "s.student_name"
      )
      .where("s.student_name", "like", `%${term}%`)
      .orWhereRaw("CAST(s.student_id AS CHAR) LIKE ?", [`%${term}%`]);
  },

  add: async (data, callback) => {
    try {
      const result = await db("graduation_certificates").insert({
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
      const result = await db("graduation_certificates")
        .where("certificate_id", certificateId)
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
      const result = await db("graduation_certificates")
        .where("certificate_id", certificateId)
        .del();
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },
};

module.exports = GraduateCert;
