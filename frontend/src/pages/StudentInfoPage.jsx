import React, { useState, useEffect } from "react";
import api from "../api.js";
import { useParams } from "react-router-dom";
import ConfirmDialog from "../components/FormDialog.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/StudentInfoPage.css";
import ProgressTable from "../components/ProgressTable.jsx";

function StudentInfoPage() {
  const [studentInfo, setStudentInfo] = useState(null);
  const { student_id } = useParams();
  const [showEdit, setShowEdit] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // form fields
  const [agencyName, setAgencyName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [professionalLevel, setProfessionalLevel] = useState("");
  const [partyJoinDate, setPartyJoinDate] = useState("");
  const [planTitle, setPlanTitle] = useState("");

  // ConfirmDialog state
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmParams({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () =>
    setConfirmParams((cp) => ({ ...cp, isOpen: false }));

  // load student info
  useEffect(() => {
    api
      .get(`/api/v1/student/${student_id}`)
      .then((res) => res.data)
      .then((data) => {
        setStudentInfo(data);
        // initialize form
        setStudentName(data.student_name || "");
        setAgencyName(data.agency_name || "");
        setProfessionalLevel(data.professional_level || "");
        setPartyJoinDate(data.party_join_date || "");
        setPlanTitle(data.plan_title || "");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin học viên", err);
        toast.error("Không tải được thông tin học viên");
      });
  }, [student_id]);

  const OpenEdit = () => setShowEdit(true);
  const CloseEdit = () => setShowEdit(false);
  const handleShowProgress = () => setShowProgress(true);
  const handleCloseProgress = () => setShowProgress(false);

  const handleEdit = (e) => {
    e.preventDefault();
    // compute changes
    const changes = [];
    if (studentName !== studentInfo.student_name)
      changes.push(`Họ tên: ${studentInfo.student_name} → ${studentName}`);
    if (agencyName !== studentInfo.agency_name)
      changes.push(`Đơn vị: ${studentInfo.agency_name} → ${agencyName}`);
    if (professionalLevel !== studentInfo.professional_level)
      changes.push(
        `Chức vị: ${studentInfo.professional_level} → ${professionalLevel}`
      );
    if (partyJoinDate !== studentInfo.party_join_date) {
      const oldD = studentInfo.party_join_date
        ? new Date(studentInfo.party_join_date).toLocaleDateString("vi-VN")
        : "(chưa có)";
      changes.push(
        `Ngày kết nạp: ${oldD} → ${new Date(partyJoinDate)
          .toISOString()
          .slice(0, 10)}`
      );
    }
    if (planTitle !== studentInfo.plan_title)
      changes.push(`Kế hoạch: ${studentInfo.plan_title} → ${planTitle}`);

    if (!changes.length) {
      toast.info("Không có thay đổi nào");
      return;
    }

    // open confirm dialog
    openConfirm({
      title: "Xác nhận cập nhật thông tin",
      message: changes.join("\n"),
      onConfirm: () => {
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
            setShowEdit(false);
            toast.success("Cập nhật thành công");
          })
          .catch((err) => {
            console.error("Lỗi cập nhật:", err);
            toast.error("Cập nhật thất bại");
          });
        closeConfirm();
      },
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={confirmParams.title}
        message={confirmParams.message}
        onConfirm={confirmParams.onConfirm}
        onCancel={closeConfirm}
      />

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
                  ? new Date(studentInfo.birthday).toLocaleDateString("vi-VN")
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
              <span className="info-label">Chức vụ:</span>
              <span className="info-value">
                {studentInfo?.professional_level}
              </span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Ngày kết nạp:</span>
              <span className="info-value">
                {studentInfo?.party_join_date
                  ? new Date(studentInfo.party_join_date).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Chức danh quy hoạch:</span>
              <span className="info-value">{studentInfo?.plan_title}</span>
            </div>

            <div className="student-info-row">
              <span className="info-label">Đơn vị công tác</span>
              <span className="info-value">{studentInfo?.agency_name}</span>
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
                  <label>Họ tên:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <label>Chức vị:</label>
                  <input
                    type="text"
                    value={professionalLevel}
                    onChange={(e) => setProfessionalLevel(e.target.value)}
                  />
                  <label>Đơn vị:</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                  <label>Ngày kết nạp:</label>
                  <input
                    type="date"
                    value={
                      partyJoinDate
                        ? new Date(partyJoinDate).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => setPartyJoinDate(e.target.value)}
                  />
                  <label>Tiêu đề kế hoạch:</label>
                  <input
                    type="text"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                  />
                  <div className="student-edit-action">
                    <button type="submit" className="student-btn-save">
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={CloseEdit}
                      className="student-btn-cancel"
                    >
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
    </>
  );
}

export default StudentInfoPage;
