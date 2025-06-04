const scheduleModel = require("../models/scheduleModel");

/**
 * GET /api/v1/schedules
 */
const getFullSchedule = async (req, res) => {
  try {
    const rows = await scheduleModel.getAllWithDetails();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/v1/schedules
 * Body:
 * {
 *   "study_date":    "2025-07-01",
 *   "room_id":       1,
 *   "exSchedule_id": null,
 *   "assignment_id": 5
 * }
 */
const createSchedule = async (req, res) => {
  const { study_date, room_id, exSchedule_id, assignment_id } = req.body;
  if (!study_date || !room_id || !assignment_id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }
  try {
    const inserted = await scheduleModel.createSchedule({
      study_date,
      room_id,
      exSchedule_id,
      assignment_id,
    });
    // inserted = [ { schedule_id: X } ] với MySQL2+Knex
    const schedId = inserted[0].schedule_id || inserted[0];
    return res
      .status(201)
      .json({ success: true, data: { schedule_id: schedId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/v1/schedules/:scheduleId
 */
const updateSchedule = async (req, res) => {
  const scheduleId = parseInt(req.params.scheduleId, 10);
  const { study_date, room_id, exSchedule_id, assignment_id } = req.body;
  if (!study_date || !room_id || !assignment_id) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin bắt buộc" });
  }
  try {
    const affected = await scheduleModel.updateSchedule(scheduleId, {
      study_date,
      room_id,
      exSchedule_id,
      assignment_id,
    });
    if (affected === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getFullSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
