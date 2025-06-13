import api from "../api";
import { useEffect, useState } from "react";
import Select from "react-select";
import "../styles/ExamAssignmentPage.css";

function ExamAssignmentPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const [assignedList, setAssignedList] = useState([]);
  // lấy danh sách select
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // Bộ lọc chính dùng để search
  const [subject_id, setSubject] = useState("");
  const [class_id, setClass] = useState("");

  // Modal state
  const [modalSubjectId, setModalSubjectId] = useState("");
  const [modalClassId, setModalClassId] = useState("");
  const [modalExamFormat, setModalExamFormat] = useState("");
  const [modalAssignmentId, setModalAssignmentId] = useState(""); // lưu trạng thái assignment_id sau khi có subject_id và class_id

  // State cho chức năng edit
  const [editingId, setEditingId] = useState(null); // ID của item đang được edit
  const [editFormat, setEditFormat] = useState(""); // Format mới khi edit

  const OpenAddForm = () => setShowAddModal(true);
  const CloseAddModal = () => {
    setShowAddModal(false);
    // Reset modal state khi đóng
    setModalSubjectId("");
    setModalClassId("");
    setModalExamFormat("");
    setModalAssignmentId("");
  };

  useEffect(() => {
    getSubject();
  }, []);

  useEffect(() => {
    if (subject_id) {
      getClassBySubject(subject_id);
    }
  }, [subject_id]);

  useEffect(() => {
    if (modalSubjectId) {
      getClassBySubject(modalSubjectId);
    }
  }, [modalSubjectId]);

  useEffect(() => {
    // theo dõi subject_id và class_id khi người dùng có thay đổi
    const fetchModalAssignmentId = async () => {
      if (modalSubjectId && modalClassId) {
        try {
          const id = await getAssignId(modalSubjectId, modalClassId); // gọi getAssign và cập nhật modalAssignmentId
          console.log("Assignment ID fetched:", id); // Debug log
          setModalAssignmentId(id);
        } catch (err) {
          console.error("Lỗi khi lấy assignment_id:", err);
          setModalAssignmentId("");
        }
      } else {
        setModalAssignmentId(""); // Reset khi không đủ thông tin
      }
    };
    fetchModalAssignmentId();
  }, [modalSubjectId, modalClassId]);

  const getSubject = async () => {
    try {
      const res = await api.get("/api/v1/assignment/subjects");
      const subjectOptions = res.data.map((s) => ({
        value: s.subject_id,
        label: s.subject_name,
      }));
      setSubjectOptions(subjectOptions);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách môn học:", err);
    }
  };

  const getClassBySubject = async (subject_id) => {
    try {
      const res = await api.get(`/api/v1/assignment/class/${subject_id}`);
      const classOptions = res.data.map((c) => ({
        value: c.class_id,
        label: `${c.class_name} - ${c.course_name}`,
      }));
      setClassOptions(classOptions);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lớp học:", err);
      setClassOptions([]);
    }
  };

  const getAssignId = async (subject_id, class_id) => {
    try {
      console.log("Gọi API getid với:", { subject_id, class_id }); // Debug log
      const res = await api.get("/api/v1/assignment/getid", {
        params: { subject_id, class_id },
      });
      console.log("API response:", res.data); // Debug log

      // API trả về array, lấy phần tử đầu tiên
      if (res.data && res.data.length > 0) {
        return res.data[0].assignment_id;
      } else {
        throw new Error("Không tìm thấy assignment_id");
      }
    } catch (err) {
      console.error("Lỗi khi lấy assignment_id:", err);
      throw err;
    }
  };

  const getAllAssignment = async () => {
    if (!subject_id || !class_id) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }
    try {
      const res = await api.get("/api/v1/exam-assignment/", {
        params: {
          subject_id: subject_id,
          class_id: class_id,
        },
      });
         console.log("res.data:", res.data);
      if(res.data && res.data.length > 0){
        setAssignedList(res.data);
      }
      else{
        setAssignedList([]);
        alert("Không tìm thấy hình thức thi nào cho lớp và học phần đã chọn");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách exam assignment:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getAllAssignment();
  };

  const handleExamAssignment = async (e) => {
    e.preventDefault();

    if (!modalExamFormat || !modalSubjectId || !modalClassId) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    try {
      // Lấy assignment_id một lần nữa để đảm bảo
      let assignment_id = modalAssignmentId;

      if (!assignment_id) {
        console.log("Không có assignment_id trong state, lấy lại từ API...");
        assignment_id = await getAssignId(modalSubjectId, modalClassId);
      }

      console.log("assignment_id sẽ gửi:", assignment_id);

      if (!assignment_id) {
        alert("Không thể lấy được assignment_id");
        return;
      }

      const res = await api.post("/api/v1/exam-assignment/add", {
        exam_format: modalExamFormat,
        assignment_id: assignment_id,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Thêm thành công");
        CloseAddModal();
        // Refresh danh sách sau khi thêm thành công
        getAllAssignment();
      } else {
        alert("Thêm thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi thêm exam-assignment:", err);
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };

  // Bắt đầu chỉnh sửa
  const startEdit = (scheduleId, currentFormat) => {
    setEditingId(scheduleId);
    setEditFormat(currentFormat);
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormat("");
  };

  // Xử lý cập nhật exam format
  const handleEdit = async (scheduleId) => {
    if (!editFormat) {
      alert("Vui lòng chọn hình thức thi");
      return;
    }

    try {
      const res = await api.put(`/api/v1/exam-assignment/edit/${scheduleId}`, {
        exam_format: editFormat,
      });

      if (res.status === 200) {
        alert("Cập nhật thành công");
        // Cập nhật lại danh sách
        setAssignedList((prevList) =>
          prevList.map((item) =>
            item.exSchedule_id === scheduleId
              ? { ...item, exam_format: editFormat }
              : item
          )
        );
        // Reset trạng thái edit
        setEditingId(null);
        setEditFormat("");
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật exam-assignment:", err);
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="exam-assign-container">
      <div className="exam-assign-filter">
        <form onSubmit={handleSearch}>
          <Select
            options={subjectOptions}
            onChange={(option) => setSubject(option ? option.value : "")}
            placeholder="Chọn môn học"
          />
          <Select
            options={classOptions}
            onChange={(option) => setClass(option ? option.value : "")}
            placeholder="Chọn lớp học"
          />
          <button type="submit">Tìm kiếm</button>
          <button type="button" onClick={OpenAddForm}>
            Tạo mới
          </button>
        </form>
      </div>

      <div className="exam-assign-show-table">
        {assignedList.map((exam_schedule) => (
          <div key={exam_schedule.exSchedule_id} className="exam-schedule-item">
            <p>
              <strong>Môn học: </strong>
              {exam_schedule.subject_name}
            </p>
            <p>
              <strong>Lớp - khoá học: </strong>
              {exam_schedule.class_name} - {exam_schedule.course_name}
            </p>
            <p>
              <strong>Hình thức thi: </strong>
              {editingId === exam_schedule.exSchedule_id ? (
                <select
                  value={editFormat}
                  onChange={(e) => setEditFormat(e.target.value)}
                  className="edit-format-select"
                >
                  <option value="">Chọn hình thức thi</option>
                  <option value="Trắc nghiệm">Trắc nghiệm</option>
                  <option value="Tự luận">Tự luận</option>
                  <option value="Vấn đáp">Vấn đáp</option>
                </select>
              ) : (
                exam_schedule.exam_format
              )}
            </p>

            <div className="exam-schedule-actions">
              {editingId === exam_schedule.exSchedule_id ? (
                <>
                  <button
                    onClick={() => handleEdit(exam_schedule.exSchedule_id)}
                    className="save-btn"
                  >
                    Lưu
                  </button>
                  <button onClick={cancelEdit} className="cancel-btn">
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    startEdit(
                      exam_schedule.exSchedule_id,
                      exam_schedule.exam_format
                    )
                  }
                  className="edit-btn"
                >
                  Sửa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="exam-assign-add-form">
          <form onSubmit={handleExamAssignment}>
            <Select
              options={subjectOptions}
              onChange={(option) => {
                const value = option ? option.value : "";
                console.log("subject_id được chọn:", value);
                setModalSubjectId(value);
                // Reset class khi thay đổi subject
                setModalClassId("");
              }}
              placeholder="Chọn môn học"
              isSearchable
            />
            <Select
              options={classOptions}
              value={
                classOptions.find((option) => option.value === modalClassId) ||
                null
              }
              onChange={(option) => {
                const value = option ? option.value : "";
                console.log("class_id được chọn:", value);
                setModalClassId(value);
              }}
              placeholder="Chọn lớp học"
            />
            <select
              value={modalExamFormat}
              onChange={(e) => setModalExamFormat(e.target.value)}
            >
              <option value="">Chọn hình thức thi</option>
              <option value="Trắc nghiệm">Trắc nghiệm</option>
              <option value="Tự luận">Tự luận</option>
              <option value="Vấn đáp">Vấn đáp</option>
            </select>

            <button type="submit" disabled={!modalAssignmentId}>
              Tạo {modalAssignmentId ? "" : "(Đang tải...)"}
            </button>
            <button type="button" onClick={CloseAddModal}>
              Huỷ
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ExamAssignmentPage;
