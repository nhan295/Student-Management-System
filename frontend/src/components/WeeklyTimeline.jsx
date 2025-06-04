import React from "react";
import "../styles/schedule.css";

export default function WeeklyTimeline({
  schedules,
  lecturers,
  selectedLecturer,
  setSelectedLecturer,
  currentSunday,
  prevWeek,
  nextWeek,
  goToday,
}) {
  // --- Tính toán 7 ngày trong tuần (CN→Thứ 7) ---
  const daysOfWeek = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(currentSunday);
    d.setDate(currentSunday.getDate() + idx);
    return {
      iso: d.toISOString().slice(0, 10), // "YYYY-MM-DD"
      labelDay: idx === 0 ? "CN" : `Thứ ${idx + 1}`,
      labelDate: `${d.getDate()}/${d.getMonth() + 1}`,
      dateObj: d,
    };
  });

  // --- Mảng giờ từ 6 → 18 (mỗi 1h 1 dòng) ---
  const hours = Array.from({ length: 13 }, (_, i) => 6 + i); // [6,7,...,18]

  return (
    <div className="weekly-calendar-container">
      {/* ===== Controls: “Hôm nay”, <<, >>, Title Tháng Năm, Dropdown giảng viên ===== */}
      <div className="calendar-controls">
        <div className="left-group">
          <button className="today-button" onClick={goToday}>
            Hôm nay
          </button>
          <button onClick={prevWeek}>&lt;</button>
          <button onClick={nextWeek}>&gt;</button>
          <span className="current-month">
            {currentSunday.toLocaleString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="right-group">
          <label className="mr-2 font-medium text-gray-700">
            Chọn Giảng viên:
          </label>
          <select
            value={selectedLecturer}
            onChange={(e) => setSelectedLecturer(e.target.value)}
            className="form-select"
          >
            <option value="">-- Tất cả --</option>
            {lecturers.map((lec) => (
              <option key={lec.lecturer_id} value={lec.lecturer_id}>
                {lec.lecturer_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Header: ô trống góc trái + 7 cột ngày ===== */}
      <div className="calendar-header">
        <div className="corner-cell"></div>
        {daysOfWeek.map((day, idx) => {
          const isToday = day.iso === new Date().toISOString().slice(0, 10);
          return (
            <div key={idx} className={`day-cell ${isToday ? "current" : ""}`}>
              <div>{day.labelDay}</div>
              <div className="text-xs text-gray-600">{day.labelDate}</div>
            </div>
          );
        })}
      </div>

      {/* ===== Body: cột thời gian + 7 cột ngày ===== */}
      <div className="calendar-body">
        {/* Cột giờ */}
        <div className="time-column">
          {hours.map((h) => (
            <div key={h} className="time-cell">
              {h}:00
            </div>
          ))}
        </div>

        {/* 7 cột ngày */}
        {daysOfWeek.map((day, dIdx) => {
          // Lọc những event có cùng study_date = day.iso
          const eventsOfDay = schedules.filter(
            (evt) => evt.study_date.slice(0, 10) === day.iso
          );

          return (
            <div key={dIdx} className="day-column">
              {/* Hàng trống khung giờ */}
              {hours.map((h) => (
                <div key={h} className="hour-slot"></div>
              ))}

              {/* Vẽ event */}
              {eventsOfDay.map((evt) => {
                // Convert kiểu "HH:MM:SS" hoặc "HH:mm" sang số phút từ 6:00
                const start = evt.start_time.slice(0, 5); // "HH:mm"
                const end = evt.end_time.slice(0, 5); // "HH:mm"
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);

                // Số phút từ 6 AM: (sh*60 + sm) − (6*60)
                const offsetMinutes = sh * 60 + sm - 6 * 60;
                // Thời lượng (minutes)
                const duration = eh * 60 + em - (sh * 60 + sm);

                // Chuyển số phút thành pixel (giả sử mỗi giờ = 60px)
                const topPx = (offsetMinutes / 60) * 60 + 1; // +1 để cách viền chút
                const heightPx = (duration / 60) * 60 - 2; // −2 để chừa khoảng giữa

                return (
                  <div
                    key={evt.schedule_id}
                    className="calendar-event"
                    style={{
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                      left: "4px",
                      right: "4px",
                    }}
                    title={`${evt.subject_name} – ${evt.class_name}\n${start}–${end}\nPhòng: ${evt.room_name}`}
                  >
                    <div className="font-semibold text-sm">
                      {evt.subject_name}
                    </div>
                    <div className="text-xs">
                      {evt.class_name} – {evt.room_name}
                    </div>
                    <div className="text-xs">
                      {start}–{end}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
