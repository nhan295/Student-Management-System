const scheduleModel = require("../models/scheduleModel");

/**
 * GET /api/v1/schedules
 */
const getFullSchedule = async (req, res) => {
  try {
    const { startDate, endDate, lecturer_id } = req.query;

    let rows;
    // Nếu cả startDate và endDate được truyền lên, dùng hàm lọc.
    if (startDate && endDate) {
      rows = await scheduleModel.getSchedulesByCriteria({
        startDate,
        endDate,
        lecturer_id,
      });
    } else {
      // Ngược lại, trả về tất cả
      rows = await scheduleModel.getAllWithDetails();
    }

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("scheduleController.getFullSchedule error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/schedules
 */
const createSchedule = async (req, res) => {
  const {
    study_date,
    start_time,
    end_time,
    room_id,
    exSchedule_id,
    assignment_id, // đã đúng là assignment_id
  } = req.body;

  if (!study_date || !start_time || !end_time || !room_id || !assignment_id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const newRow = {
      study_date,
      start_time,
      end_time,
      room_id,
      exSchedule_id: exSchedule_id || null,
      assignment_id,
    };

    const inserted = await scheduleModel.createSchedule(newRow);
    const schedId = inserted[0].schedule_id || inserted[0];

    return res
      .status(201)
      .json({ success: true, data: { schedule_id: schedId } });
  } catch (err) {
    console.error("scheduleController.createSchedule error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/schedules/:scheduleId
 */
const updateSchedule = async (req, res) => {
  const scheduleId = parseInt(req.params.scheduleId, 10);

  const {
    study_date,
    start_time,
    end_time,
    room_id,
    exSchedule_id,
    assignment_id,
  } = req.body;

  if (!study_date || !start_time || !end_time || !room_id || !assignment_id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }

  try {
    const updatedRow = {
      study_date,
      start_time,
      end_time,
      room_id,
      exSchedule_id: exSchedule_id || null,
      assignment_id,
    };

    const affected = await scheduleModel.updateSchedule(scheduleId, updatedRow);
    if (affected === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("scheduleController.updateSchedule error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/v1/schedules/:scheduleId
 */
const deleteSchedule = async (req, res) => {
  const scheduleId = parseInt(req.params.scheduleId, 10);

  try {
    const deleted = await scheduleModel.deleteSchedule(scheduleId);
    if (deleted === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch" });
    }
    return res.status(200).json({ success: true, message: "Đã xóa lịch" });
  } catch (err) {
    console.error("scheduleController.deleteSchedule error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getFullSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
