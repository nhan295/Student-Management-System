// models/subjectModel.js
const db = require("../config/db");

const Subject = {
  getAll: () => db("subjects").select("*"),

  create: (subject) => db("subjects").insert(subject),

  updateById: (subject_id, subject) =>
    db("subjects").where({ subject_id }).update(subject),

  deleteById: (subject_id) => db("subjects").where({ subject_id }).del(),
};

module.exports = Subject;
