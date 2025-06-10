const assignmentModel = require("../models/assignmentModel");

const assignLecturer = async (req, res) => {
  const { lecturer_id, subject_id, class_id } = req.body;
  try {
    if (!lecturer_id || !subject_id || !class_id) {
      return res.status(400).json({ message: "Bạn nhập thiếu trường" });
    }
    await assignmentModel.assignLecturer(lecturer_id, subject_id, class_id);
    return res.status(200).json({ message: "Đã thêm vào phân công" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const showAssigned = async (req, res) => {
  try {
    const result = await assignmentModel.showAssigned();
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Không tìm thấy bảng phân công" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const delAssign = async (req, res) => {
  const { assignment_id } = req.params;
  try {
    const result = await assignmentModel.delAssign(assignment_id);
    if (result) {
      return res.status(200).json({ message: "Đã xóa phân công" });
    }
  } catch (err) {
    console.error("Lỗi khi xoá phân công", err);
    return res
      .status(500)
      .json({ message: "Giảng viên đã có lịch học, không thể xoá phân công" });
  }
};

const editAssign = async (req, res) => {
  const { assignment_id } = req.params;
  const { lecturer_id, subject_id, class_id } = req.body;
  try {
    if (!lecturer_id || !subject_id || !class_id) {
      return res.status(400).json({ message: "Bạn nhập thiếu trường" });
    }
    const result = await assignmentModel.editAssign(
      assignment_id,
      lecturer_id,
      subject_id,
      class_id
    );
    if (result) {
      return res.status(200).json({ message: "Đã cập nhật phân công" });
    } else {
      return res
        .status(400)
        .json({ message: "Không tìm thấy phân công để cập nhật" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
const getSubject = async (req, res) => {
  try {
    const subjectList = await assignmentModel.getSubject();
    if (subjectList) {
      return res.status(200).json(subjectList);
    } else {
      return res.status(404).json({ message: "Không tìm thấy môn học" });
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách môn học:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getClassBySubject = async (req, res) => {
  const { subject_id } = req.params;
  try {
    const classList = await assignmentModel.getClassBySubject(subject_id);
    if (classList) {
      return res.status(200).json(classList);
    } else {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lớp học cho môn này" });
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách lớp học:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
module.exports = {
  assignLecturer,
  showAssigned,
  delAssign,
  editAssign,
  getSubject,
  getClassBySubject,
};
