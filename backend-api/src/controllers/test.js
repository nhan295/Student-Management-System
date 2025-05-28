const db = require("../config/db");

exports.getAllStudents = async (req, res) => {
  try {
    const subjects = await db("subjects").select("*");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
