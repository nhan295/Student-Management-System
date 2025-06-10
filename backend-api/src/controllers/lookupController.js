const lookupModel = require("../models/lookupModel");

// Returns all rooms
const getRooms = async (req, res) => {
  try {
    const rows = await lookupModel.getRooms();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getRooms:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Returns all classes
const getClasses = async (req, res) => {
  try {
    const rows = await lookupModel.getClasses();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getClasses:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Returns all subjects
const getSubjects = async (req, res) => {
  try {
    const rows = await lookupModel.getSubjects();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getSubjects:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Returns all lecturers
const getLecturers = async (req, res) => {
  try {
    const rows = await lookupModel.getLecturers();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getLecturers:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ───────────────────────────────────────────────────────────
// Thêm controller mới: getAssignments
const getAssignments = async (req, res) => {
  try {
    const rows = await lookupModel.getAssignments();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error in getAssignments:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
// ───────────────────────────────────────────────────────────

module.exports = {
  getRooms,
  getClasses,
  getSubjects,
  getLecturers,
  getAssignments, // Export mới
};
