import React, { useState } from "react";
import Assignment from "./AssignmentPage";
import ScheduleTab from "../components/scheduleTab";
import "../styles/schedule.css";
import "../styles/AssignmentPage.css";
import "../styles/ShowAssign.css";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="schedule-container">
      {/* Tab Bar */}
      <div className="tab-bar">
        <div className="tab-bar-inner">
          <button
            onClick={() => setActiveTab("assignment")}
            className={
              activeTab === "assignment" ? "tab-button active" : "tab-button"
            }
          >
            <span role="img" aria-label="teacher" style={{ marginRight: 8 }}>
              👩‍🏫
            </span>
            Phân công Giảng viên
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={
              activeTab === "schedule" ? "tab-button active" : "tab-button"
            }
          >
            <span role="img" aria-label="calendar" style={{ marginRight: 8 }}>
              🗓️
            </span>
            Sắp lịch Học
          </button>
        </div>
      </div>

      {/* Nội dung tab */}
      <div className="tab-content">
        {activeTab === "assignment" && <Assignment />}
        {activeTab === "schedule" && <ScheduleTab />}
      </div>
    </div>
  );
}
