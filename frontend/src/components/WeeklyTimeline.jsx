import React from "react";
import "../styles/Schedule.css";

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
  // --- Helpers ---

  // Parse date string an toàn
  const parseDate = (dateString) => {
    if (dateString.includes("T") || dateString.includes("Z")) {
      return new Date(dateString);
    }
    return new Date(dateString + "T00:00:00");
  };

  // Format date theo local time: YYYY-MM-DD
  const formatDateLocal = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Tính 7 ngày trong tuần bắt đầu từ currentSunday
  const daysOfWeek = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(currentSunday);
    d.setDate(currentSunday.getDate() + idx);

    return {
      iso: formatDateLocal(d),
      labelDay: idx === 0 ? "CN" : `Thứ ${idx + 1}`,
      labelDate: `${d.getDate()}/${d.getMonth() + 1}`,
      dateObj: d,
    };
  });

  // Mảng giờ từ 6h đến 18h
  const hours = Array.from({ length: 13 }, (_, i) => 6 + i);

  // Lấy ngày hôm nay theo local time
  const todayISO = formatDateLocal(new Date());

  return (
    <div className="weekly-calendar-container">
      {/* Controls */}
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
              timeZone: "Asia/Ho_Chi_Minh",
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

      {/* Header */}
      <div className="calendar-header">
        <div className="corner-cell"></div>
        {daysOfWeek.map((day, idx) => {
          const isToday = day.iso === todayISO;
          return (
            <div key={idx} className={`day-cell ${isToday ? "current" : ""}`}>
              <div>{day.labelDay}</div>
              <div className="text-xs text-gray-600">{day.labelDate}</div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="calendar-body">
        {/* Cột giờ */}
        <div className="time-column">
          {hours.map((h) => (
            <div key={h} className="time-cell">
              {h}:00
            </div>
          ))}
        </div>

        {/* Các cột ngày */}
        {daysOfWeek.map((day, dIdx) => {
          const eventsOfDay = schedules.filter((evt) => {
            const eventDate = formatDateLocal(parseDate(evt.study_date));
            return eventDate === day.iso;
          });

          return (
            <div key={dIdx} className="day-column">
              {hours.map((h) => (
                <div key={h} className="hour-slot"></div>
              ))}

              {eventsOfDay.map((evt) => {
                const start = evt.start_time.slice(0, 5);
                const end = evt.end_time.slice(0, 5);
                const [sh, sm] = start.split(":").map(Number);
                const [eh, em] = end.split(":").map(Number);

                const offsetMinutes = sh * 60 + sm - 6 * 60;
                const duration = eh * 60 + em - (sh * 60 + sm);

                const topPx = Math.max(1, (offsetMinutes / 60) * 60 + 1);
                const heightPx = Math.max(20, (duration / 60) * 60 - 2);

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
                    title={`${evt.subject_name} – ${evt.class_name}\n${start}–${end}\nPhòng: ${evt.room_name}\nGiảng viên: ${evt.lecturer_name}`}
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

              {eventsOfDay.length > 0 && (
                <div
                  className="debug-info"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "2px",
                    fontSize: "10px",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    padding: "2px",
                    borderRadius: "2px",
                  }}
                >
                  {eventsOfDay.length} events
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
