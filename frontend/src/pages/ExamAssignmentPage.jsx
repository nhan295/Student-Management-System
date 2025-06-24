import api from "../api";
import { useEffect, useState } from "react";
import Select from "react-select";
import ConfirmDialog from "../components/FormDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ExamAssignmentPage.css";
import "react-toastify/dist/ReactToastify.css";

function ExamAssignmentPage() {
  // ─── Form selections ───
  const [subject_id, setSubject] = useState("");
  const [class_id, setClass] = useState("");

  // ─── Options for selects ───
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // ─── Assigned list ───
  const [assignedList, setAssignedList] = useState([]);

  // ─── Modal state ───
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalSubjectId, setModalSubjectId] = useState("");
  const [modalClassId, setModalClassId] = useState("");
  const [modalExamFormat, setModalExamFormat] = useState("");
  const [modalAssignmentId, setModalAssignmentId] = useState(""); // lưu trạng thái assignment_id sau khi có subject_id và class_id

  // ─── Edit state ───
  const [editingId, setEditingId] = useState(null); // ID của item đang được edit
  const [editFormat, setEditFormat] = useState(""); // Format mới khi edit

  // ─── ConfirmDialog state ───
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmParams({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmParams((cp) => ({ ...cp, isOpen: false }));
  };

  // ─── Effects ───
  useEffect(() => {
    getSubjectOptions();
  }, []);

  useEffect(() => {
    if (subject_id) getClassOptions(subject_id);
  }, [subject_id]);

  useEffect(() => {
    if (modalSubjectId) getClassOptions(modalSubjectId);
  }, [modalSubjectId]);

  // ─── API calls ───
  const getSubjectOptions = async () => {
    try {
      const res = await api.get("/api/v1/assignment/subjects");
      setSubjectOptions(
        res.data.map((s) => ({ value: s.subject_id, label: s.subject_name }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách học phần");
    }
  };

  const getClassOptions = async (subject_id) => {
    try {
      const res = await api.get(`/api/v1/assignment/class/${subject_id}`);
      setClassOptions(
        res.data.map((c) => ({
          value: c.class_id,
          label: `${c.class_name} - ${c.course_name}`,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy danh sách lớp học");
    }
  };

  const getAssignId = async (subjId, clsId) => {
    const res = await api.get("/api/v1/assignment/getid", {
      params: { subject_id: subjId, class_id: clsId },
    });
    if (res.data.length) return res.data[0].assignment_id;
    throw new Error("Không tìm thấy assignment_id");
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    setModalSubjectId("");
    setModalClassId("");
    setModalExamFormat("");
    setModalAssignmentId("");
  };

  useEffect(() => {
    // theo dõi subject_id và class_id khi người dùng có thay đổi
    const fetchModalAssignId = async () => {
      if (modalSubjectId && modalClassId) {
        try {
          const id = await getAssignId(modalSubjectId, modalClassId); // gọi getAssign và cập nhật modalAssignmentId
          setModalAssignmentId(id);
        } catch {
          toast.warn("Không lấy được assignment_id");
        }
      }
    };
    fetchModalAssignId();
  }, [modalSubjectId, modalClassId]);

  const handleAddClick = (e) => {
    e.preventDefault();
    if (!modalAssignmentId || !modalExamFormat)
      return toast.warn("Chọn đầy đủ thông tin trước khi tạo");
    openConfirm({
      title: "Xác nhận tạo mới",
      message: `Học phần: ${modalSubjectId}\nLớp: ${modalClassId}\nHình thức: ${modalExamFormat}`,
      onConfirm: async () => {
        try {
          await api.post("/api/v1/exam-assignment/add", {
            exam_format: modalExamFormat,
            assignment_id: modalAssignmentId,
          });
          toast.success("Tạo hình thức thi thành công");
          closeAddModal();
        } catch (err) {
          console.error(err);
          toast.error("Lỗi khi tạo hình thức thi");
        }
      },
    });
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
      if (res.data && res.data.length > 0) {
        setAssignedList(res.data);
      } else {
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

  const handleEditClick = (id, format) => {
    openConfirm({
      title: "Xác nhận cập nhật",
      message: `Bạn có chắc muốn đổi hình thức ID ${id} thành ${format}?`,
      onConfirm: async () => {
        try {
          await api.put(`/api/v1/exam-assignment/edit/${id}`, {
            exam_format: format,
          });
          toast.success("Cập nhật thành công");
          setAssignedList((prev) =>
            prev.map((item) =>
              item.exSchedule_id === id
                ? { ...item, exam_format: format }
                : item
            )
          );
          setEditingId(null);
        } catch (err) {
          console.error(err);
          toast.error("Lỗi khi cập nhật hình thức thi");
        }
      },
    });
  };

  const handleDelete = async (exSchedule_id) => {
    try {
      await api.delete(`/api/v1/exam-assignment/delete/${exSchedule_id}`);
      toast.success("Đã xoá nội dung thi");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xoá nội dung thi");
    }
  };

  return (
    <div className="exam-assign-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />
      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={confirmParams.title}
        message={confirmParams.message}
        onConfirm={() => {
          confirmParams.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />

      <div className="exam-assign-filter">
        <form onSubmit={handleSearch}>
          <Select
            options={subjectOptions}
            onChange={(opt) => setSubject(opt?.value || "")}
            placeholder="Chọn học phần"
          />
          <Select
            options={classOptions}
            onChange={(opt) => setClass(opt?.value || "")}
            placeholder="Chọn lớp học"
          />
          <button type="submit">Tìm kiếm</button>
          <button type="button" onClick={openAddModal}>
            Tạo mới
          </button>
        </form>
      </div>

      <div className="exam-assign-show-table">
        {assignedList.map((item) => (
          <div key={item.exSchedule_id} className="exam-schedule-item">
            <p>
              <strong>Học phần: </strong>
              {item.subject_name}
            </p>
            <p>
              <strong>Lớp - khóa: </strong>
              {item.class_name} - {item.course_name}
            </p>
            <p>
              <strong>Hình thức thi: </strong>
              {editingId === item.exSchedule_id ? (
                <select
                  value={editFormat}
                  onChange={(e) => setEditFormat(e.target.value)}
                >
                  <option value="">Chọn hình thức</option>
                  <option value="Trắc nghiệm">Trắc nghiệm</option>
                  <option value="Tự luận">Tự luận</option>
                  <option value="Vấn đáp">Vấn đáp</option>
                </select>
              ) : (
                item.exam_format
              )}
            </p>

            <div className="exam-schedule-actions">
              {editingId === item.exSchedule_id ? (
                <>
                  <button
                    onClick={() =>
                      handleEditClick(item.exSchedule_id, editFormat)
                    }
                    className="ex-assign-save-btn"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="ex-assign-cancel-btn"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(item.exSchedule_id);
                    setEditFormat(item.exam_format);
                  }}
                  className="ex-assign-edit-btn"
                >
                  Sửa
                </button>
              )}

              <button
                className="ex-assign-delete-btn"
                onClick={() => handleDelete(item.exSchedule_id)}
              >
                Xoá
              </button>

              {/* Toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                pauseOnHover
              />
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="exam-assign-add-form">
          <form onSubmit={handleAddClick}>
            <Select
              options={subjectOptions}
              onChange={(opt) => {
                setModalSubjectId(opt?.value || "");
                setModalClassId("");
              }}
              placeholder="Chọn học phần"
            />
            <Select
              options={classOptions}
              value={classOptions.find((o) => o.value === modalClassId)}
              onChange={(opt) => setModalClassId(opt?.value || "")}
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
            <button
              type="submit"
              disabled={!modalExamFormat || !modalAssignmentId}
            >
              Tạo
            </button>
            <button type="button" onClick={closeAddModal}>
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ExamAssignmentPage;
