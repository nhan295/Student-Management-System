// src/pages/StudentInfoPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useParams } from "react-router-dom";
import "../styles/StudentInfoPage.css"; // CSS giữ nguyên
import ProgressTable from "../components/ProgressTable.jsx";

function StudentInfoPage() {
  const [studentInfo, setStudentInfo] = useState(null);
  const { student_id } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showProgress, setShowProgress] = useState(false); // state để điều khiển hiển thị bảng tiến độ
  const [agencyName, setAgencyName] = useState("");
  const [studentName, setStudentName] = useState(
    studentInfo?.student_name || ""
  );
  const [professionalLevel, setProfessionalLevel] = useState(
    studentInfo?.professional_level || ""
  );
  const [partyJoinDate, setPartyJoinDate] = useState(
    studentInfo?.party_join_date || ""
  );
  const [planTitle, setPlanTitle] = useState(studentInfo?.plan_title || "");

  const OpenEdit = () => {
    setStudentName(studentInfo?.student_name || "");
    setAgencyName(studentInfo?.agency_name || "");
    setProfessionalLevel(studentInfo?.professional_level || "");
    setPartyJoinDate(studentInfo?.party_join_date || "");
    setPlanTitle(studentInfo?.plan_title || "");
    setShowEdit(true);
  };

  const CloseEdit = () => {
    setShowEdit(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    api
      .put(`/api/v1/student/edit/${student_id}`, {
        student_name: studentName,
        agency_name: agencyName,
        professional_level: professionalLevel,
        party_join_date: partyJoinDate,
        plan_title: planTitle,
      })
      .then((res) => res.data)
      .then((data) => {
        setStudentInfo(data);
        setStudentName(data.student_name || "");
        setProfessionalLevel(data.professional_level || "");
        setPartyJoinDate(data.party_join_date || "");
        setPlanTitle(data.plan_title || "");
        setShowEdit(false);
      })
      .catch((err) => {
        console.log(
          "Lỗi khi cập nhật thông tin học viên",
          err.response?.data || err.message
        );
      });
  };

  useEffect(() => {
    api
      .get(`/api/v1/student/${student_id}`)
      .then((res) => res.data)
      .then((data) => {
        setStudentInfo(data);
      })
      .catch((err) => {
        console.log("Lỗi khi lấy thông tin học viên", err);
      });
  }, [student_id]);

  const handleShowProgress = () => {
    setShowProgress(true);
  };
  const handleCloseProgress = () => {
    setShowProgress(false);
  };

  return (
    
      <div className="student-container">
        <div className="student-info-card">
          <div className="student-info-header">
            <h2>Thông tin sinh viên</h2>
          </div>

          <div className="student-info-content">
            <div className="student-info-row">
              <span className="info-label">Họ tên:</span>
              <span className="info-value">{studentInfo?.student_name}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Mã học viên:</span>
              <span className="info-value">{studentInfo?.student_id}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Ngày sinh:</span>
              <span className="info-value">
                {studentInfo?.birthday
                  ? new Date(studentInfo.birthday).toISOString().slice(0, 10)
                  : ""}
              </span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Giới tính:</span>
              <span className="info-value">{studentInfo?.gender}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Lớp:</span>
              <span className="info-value">{studentInfo?.class_name}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Khoá học:</span>
              <span className="info-value">{studentInfo?.course_name}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Đơn vị:</span>
              <span className="info-value">{studentInfo?.agency_name}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Chức vị:</span>
              <span className="info-value">
                {studentInfo?.professional_level}
              </span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Ngày kết nạp:</span>
              <span className="info-value">{studentInfo?.party_join_date}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Tiêu đề kế hoạch:</span>
              <span className="info-value">{studentInfo?.plan_title}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Barcode:</span>
              <span className="info-value">{studentInfo?.barcode}</span>
            </div>
          </div>

          <div className="student-info-actions">
            <button className="btn-info-edit" onClick={OpenEdit}>
              Sửa
            </button>
            <button className="btn-progress" onClick={handleShowProgress}>
              Kết quả học tập
            </button>
          </div>
        </div>

        {showEdit && (
          <div className="student-edit-modal">
            <div className="student-edit-overlay">
              <div className="student-edit-content">
                <form onSubmit={handleEdit}>
                  <label htmlFor="student_name">Họ tên:</label>
                  <input
                    type="text"
                    id="student_name"
                    onChange={(e) => setStudentName(e.target.value)}
                    value={studentName}
                  />
                  <label>Chức vị</label>
                  <input
                    type="text"
                    onChange={(e) => setProfessionalLevel(e.target.value)}
                    value={professionalLevel}
                  />
                  <label>Đơn vị</label>
                  <input
                    type="text"
                    onChange={(e) => setAgencyName(e.target.value)}
                    value={agencyName}
                  />
                  <label>Ngày kết nạp</label>
                  <input
                    type="text"
                    onChange={(e) => setPartyJoinDate(e.target.value)}
                    value={partyJoinDate}
                  />
                  <label>Tiêu đề kế hoạch</label>
                  <input
                    type="text"
                    onChange={(e) => setPlanTitle(e.target.value)}
                    value={planTitle}
                  />
                  <div className="student-edit-action">
                    <button type="submit" className="student-btn-save">
                      Lưu
                    </button>
                    <button onClick={CloseEdit} className="student-btn-cancel">
                      Huỷ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      

      {showProgress && (
        <ProgressTable studentId={student_id} onClose={handleCloseProgress} />
      )}
    </div>
  );
}

export default StudentInfoPage;
