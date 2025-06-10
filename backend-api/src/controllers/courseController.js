const courseModel = require("../models/courseModel");
const db = require("../config/db");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCourse = async (req, res) => {
  const { course_name, start_year, end_year } = req.body;
  try {
    const [course_id] = await db("courses").insert({
      course_name,
      start_year,
      end_year,
    });
    res.status(201).json({ message: "Thêm khóa học thành công", course_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
