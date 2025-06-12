const warningModel = require("../models/warningModel");

exports.getAllWarnings = async (req, res) => {
  try {
    const list = await warningModel.getAll();
    res.json(list);
  } catch (err) {
    console.error("getAllWarnings error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getWarningsByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const list = await warningModel.getByClass(classId);
    res.json(list);
  } catch (err) {
    console.error("getWarningsByClass error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getWarningsBySubject = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const list = await warningModel.getBySubject(subjectId);
    res.json(list);
  } catch (err) {
    console.error("getWarningsBySubject error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClassSubjectWithWarnings = async (req, res) => {
  try {
    const list = await warningModel.getClassSubjectWithWarnings();
    res.json(list);
  } catch (err) {
    console.error("getClassSubjectWithWarnings error:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách lớp–môn có cảnh báo" });
  }
};

exports.getWarningsByClassSubject = async (req, res) => {
  const { classId, subjectId } = req.params;
  try {
    const list = await warningModel.getByClassSubject(classId, subjectId);
    res.json(list);
  } catch (err) {
    console.error("getWarningsByClassSubject error:", err);
    res.status(500).json({ error: "Lỗi khi lấy cảnh báo lớp–môn" });
  }
};
