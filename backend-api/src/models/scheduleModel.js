// /backend/models/scheduleModel.js
const db = require("../config/db");

const scheduleModel = {
  getAllWithDetails: () => {
    return db("schedules as s")
      .join("assignment   as a", "s.assignment_id", "a.id")
      .join("Class        as c", "a.class_id", "c.class_id")
      .join("subjects     as sub", "a.subject_id", "sub.subject_id")
      .join("lecturers    as lec", "a.lecturer_id", "lec.lecturer_id")
      .join("room         as r", "s.room_id", "r.room_id")
      .leftJoin("exam_schedule as es", "s.exSchedule_id", "es.exSchedule_id")
      .select(
        "s.schedule_id",
        "s.study_date",
        "r.room_name",
        "c.class_id",
        "c.class_name",
        "sub.subject_id",
        "sub.subject_name",
        "lec.lecturer_id",
        "lec.lecturer_name",
        "s.exSchedule_id",
        "es.exam_format",
        "es.exam_date as exam_date_es",
        "s.assignment_id"
      )
      .orderBy("s.study_date", "asc")
      .orderBy("c.class_name", "asc");
  },

  // Tạo mới một lịch: insert vào schedules → lấy schedule_id
  createSchedule: async (data) => {
    return await db("schedules").insert(
      {
        study_date: data.study_date,
        room_id: data.room_id,
        exSchedule_id: data.exSchedule_id || null,
        assignment_id: data.assignment_id,
      },
      ["schedule_id"]
    );
  },

  // Update lịch
  updateSchedule: async (scheduleId, data) => {
    return await db("schedules")
      .where({ schedule_id: scheduleId })
      .update({
        study_date: data.study_date,
        room_id: data.room_id,
        exSchedule_id: data.exSchedule_id || null,
        assignment_id: data.assignment_id,
      });
  },

  // Delete lịch
  deleteSchedule: async (scheduleId) => {
    return await db("schedules").where({ schedule_id: scheduleId }).del();
  },
};
module.exports = scheduleModel;
