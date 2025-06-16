// import api from "../api";
// import { useEffect, useState } from "react";
// import Select from "react-select";
// import "../styles/ExamAssignmentPage.css";

// function ExamAssignmentPage() {
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [assignedList, setAssignedList] = useState([]);
//   // lấy danh sách select
//   const [subjectOptions, setSubjectOptions] = useState([]);
//   const [classOptions, setClassOptions] = useState([]);

//   // Bộ lọc chính dùng để search
//   const [subject_id, setSubject] = useState("");
//   const [class_id, setClass] = useState("");

//   // Modal state
//   const [modalSubjectId, setModalSubjectId] = useState("");
//   const [modalClassId, setModalClassId] = useState("");
//   const [modalExamFormat, setModalExamFormat] = useState("");
//   const [modalAssignmentId, setModalAssignmentId] = useState(""); // lưu trạng thái assignment_id sau khi có subject_id và class_id

//   // State cho chức năng edit
//   const [editingId, setEditingId] = useState(null); // ID của item đang được edit
//   const [editFormat, setEditFormat] = useState(""); // Format mới khi edit

//   const OpenAddForm = () => setShowAddModal(true);
//   const CloseAddModal = () => {
//     setShowAddModal(false);
//     // Reset modal state khi đóng
//     setModalSubjectId("");
//     setModalClassId("");
//     setModalExamFormat("");
//     setModalAssignmentId("");
//   };

//   useEffect(() => {
//     getSubject();
//   }, []);

//   useEffect(() => {
//     if (subject_id) {
//       getClassBySubject(subject_id);
//     }
//   }, [subject_id]);

//   useEffect(() => {
//     if (modalSubjectId) {
//       getClassBySubject(modalSubjectId);
//     }
//   }, [modalSubjectId]);

//   useEffect(() => {
//     // theo dõi subject_id và class_id khi người dùng có thay đổi
//     const fetchModalAssignmentId = async () => {
//       if (modalSubjectId && modalClassId) {
//         try {
//           const id = await getAssignId(modalSubjectId, modalClassId); // gọi getAssign và cập nhật modalAssignmentId
//           console.log("Assignment ID fetched:", id); // Debug log
//           setModalAssignmentId(id);
//         } catch (err) {
//           console.error("Lỗi khi lấy assignment_id:", err);
//           setModalAssignmentId("");
//         }
//       } else {
//         setModalAssignmentId(""); // Reset khi không đủ thông tin
//       }
//     };
//     fetchModalAssignmentId();
//   }, [modalSubjectId, modalClassId]);

//   const getSubject = async () => {
//     try {
//       const res = await api.get("/api/v1/assignment/subjects");
//       const subjectOptions = res.data.map((s) => ({
//         value: s.subject_id,
//         label: s.subject_name,
//       }));
//       setSubjectOptions(subjectOptions);
//     } catch (err) {
//       console.error("Lỗi khi lấy danh sách môn học:", err);
//     }
//   };

//   const getClassBySubject = async (subject_id) => {
//     try {
//       const res = await api.get(`/api/v1/assignment/class/${subject_id}`);
//       const classOptions = res.data.map((c) => ({
//         value: c.class_id,
//         label: `${c.class_name} - ${c.course_name}`,
//       }));
//       setClassOptions(classOptions);
//     } catch (err) {
//       console.error("Lỗi khi lấy danh sách lớp học:", err);
//       setClassOptions([]);
//     }
//   };

//   const getAssignId = async (subject_id, class_id) => {
//     try {
//       console.log("Gọi API getid với:", { subject_id, class_id }); // Debug log
//       const res = await api.get("/api/v1/assignment/getid", {
//         params: { subject_id, class_id },
//       });
//       console.log("API response:", res.data); // Debug log

//       // API trả về array, lấy phần tử đầu tiên
//       if (res.data && res.data.length > 0) {
//         return res.data[0].assignment_id;
//       } else {
//         throw new Error("Không tìm thấy assignment_id");
//       }
//     } catch (err) {
//       console.error("Lỗi khi lấy assignment_id:", err);
//       throw err;
//     }
//   };

//   const getAllAssignment = async () => {
//     if (!subject_id || !class_id) {
//       alert("Vui lòng chọn đầy đủ thông tin");
//       return;
//     }
//     try {
//       const res = await api.get("/api/v1/exam-assignment/", {
//         params: {
//           subject_id: subject_id,
//           class_id: class_id,
//         },
//       });
//          console.log("res.data:", res.data);
//       if(res.data && res.data.length > 0){
//         setAssignedList(res.data);
//       }
//       else{
//         setAssignedList([]);
//         alert("Không tìm thấy hình thức thi nào cho lớp và học phần đã chọn");
//       }
//     } catch (err) {
//       console.error("Lỗi khi lấy danh sách exam assignment:", err);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     getAllAssignment();
//   };

//   const handleExamAssignment = async (e) => {
//     e.preventDefault();

//     if (!modalExamFormat || !modalSubjectId || !modalClassId) {
//       alert("Vui lòng chọn đầy đủ thông tin");
//       return;
//     }

//     try {
//       // Lấy assignment_id một lần nữa để đảm bảo
//       let assignment_id = modalAssignmentId;

//       if (!assignment_id) {
//         console.log("Không có assignment_id trong state, lấy lại từ API...");
//         assignment_id = await getAssignId(modalSubjectId, modalClassId);
//       }

//       console.log("assignment_id sẽ gửi:", assignment_id);

//       if (!assignment_id) {
//         alert("Không thể lấy được assignment_id");
//         return;
//       }

//       const res = await api.post("/api/v1/exam-assignment/add", {
//         exam_format: modalExamFormat,
//         assignment_id: assignment_id,
//       });

//       if (res.status === 200 || res.status === 201) {
//         alert("Thêm thành công");
//         CloseAddModal();
//         // Refresh danh sách sau khi thêm thành công
//         getAllAssignment();
//       } else {
//         alert("Thêm thất bại");
//       }
//     } catch (err) {
//       console.error("Lỗi khi thêm exam-assignment:", err);
//       alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
//     }
//   };

//   // Bắt đầu chỉnh sửa
//   const startEdit = (scheduleId, currentFormat) => {
//     setEditingId(scheduleId);
//     setEditFormat(currentFormat);
//   };

//   // Hủy chỉnh sửa
//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditFormat("");
//   };

//   // Xử lý cập nhật exam format
//   const handleEdit = async (scheduleId) => {
//     if (!editFormat) {
//       alert("Vui lòng chọn hình thức thi");
//       return;
//     }

//     try {
//       const res = await api.put(`/api/v1/exam-assignment/edit/${scheduleId}`, {
//         exam_format: editFormat,
//       });

//       if (res.status === 200) {
//         alert("Cập nhật thành công");
//         // Cập nhật lại danh sách
//         setAssignedList((prevList) =>
//           prevList.map((item) =>
//             item.exSchedule_id === scheduleId
//               ? { ...item, exam_format: editFormat }
//               : item
//           )
//         );
//         // Reset trạng thái edit
//         setEditingId(null);
//         setEditFormat("");
//       } else {
//         alert("Cập nhật thất bại");
//       }
//     } catch (err) {
//       console.error("Lỗi khi cập nhật exam-assignment:", err);
//       alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <div className="exam-assign-container">
//       <div className="exam-assign-filter">
//         <form onSubmit={handleSearch}>
//           <Select
//             options={subjectOptions}
//             onChange={(option) => setSubject(option ? option.value : "")}
//             placeholder="Chọn môn học"
//           />
//           <Select
//             options={classOptions}
//             onChange={(option) => setClass(option ? option.value : "")}
//             placeholder="Chọn lớp học"
//           />
//           <button type="submit">Tìm kiếm</button>
//           <button type="button" onClick={OpenAddForm}>
//             Tạo mới
//           </button>
//         </form>
//       </div>

//       <div className="exam-assign-show-table">
//         {assignedList.map((exam_schedule) => (
//           <div key={exam_schedule.exSchedule_id} className="exam-schedule-item">
//             <p>
//               <strong>Môn học: </strong>
//               {exam_schedule.subject_name}
//             </p>
//             <p>
//               <strong>Lớp - khoá học: </strong>
//               {exam_schedule.class_name} - {exam_schedule.course_name}
//             </p>
//             <p>
//               <strong>Hình thức thi: </strong>
//               {editingId === exam_schedule.exSchedule_id ? (
//                 <select
//                   value={editFormat}
//                   onChange={(e) => setEditFormat(e.target.value)}
//                   className="edit-format-select"
//                 >
//                   <option value="">Chọn hình thức thi</option>
//                   <option value="Trắc nghiệm">Trắc nghiệm</option>
//                   <option value="Tự luận">Tự luận</option>
//                   <option value="Vấn đáp">Vấn đáp</option>
//                 </select>
//               ) : (
//                 exam_schedule.exam_format
//               )}
//             </p>

//             <div className="exam-schedule-actions">
//               {editingId === exam_schedule.exSchedule_id ? (
//                 <>
//                   <button
//                     onClick={() => handleEdit(exam_schedule.exSchedule_id)}
//                     className="save-btn"
//                   >
//                     Lưu
//                   </button>
//                   <button onClick={cancelEdit} className="cancel-btn">
//                     Hủy
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() =>
//                     startEdit(
//                       exam_schedule.exSchedule_id,
//                       exam_schedule.exam_format
//                     )
//                   }
//                   className="edit-btn"
//                 >
//                   Sửa
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {showAddModal && (
//         <div className="exam-assign-add-form">
//           <form onSubmit={handleExamAssignment}>
//             <Select
//               options={subjectOptions}
//               onChange={(option) => {
//                 const value = option ? option.value : "";
//                 console.log("subject_id được chọn:", value);
//                 setModalSubjectId(value);
//                 // Reset class khi thay đổi subject
//                 setModalClassId("");
//               }}
//               placeholder="Chọn môn học"
//               isSearchable
//             />
//             <Select
//               options={classOptions}
//               value={
//                 classOptions.find((option) => option.value === modalClassId) ||
//                 null
//               }
//               onChange={(option) => {
//                 const value = option ? option.value : "";
//                 console.log("class_id được chọn:", value);
//                 setModalClassId(value);
//               }}
//               placeholder="Chọn lớp học"
//             />
//             <select
//               value={modalExamFormat}
//               onChange={(e) => setModalExamFormat(e.target.value)}
//             >
//               <option value="">Chọn hình thức thi</option>
//               <option value="Trắc nghiệm">Trắc nghiệm</option>
//               <option value="Tự luận">Tự luận</option>
//               <option value="Vấn đáp">Vấn đáp</option>
//             </select>

//             <button type="submit" disabled={!modalAssignmentId}>
//               Tạo {modalAssignmentId ? "" : "(Đang tải...)"}
//             </button>
//             <button type="button" onClick={CloseAddModal}>
//               Huỷ
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ExamAssignmentPage;

import api from "../api";
import { useEffect, useState } from "react";
import Select from "react-select";
import ShowAssign from "../components/ShowAssign"; // if needed
import ConfirmDialog from "../components/formDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ExamAssignmentPage.css";

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
  const [modalAssignmentId, setModalAssignmentId] = useState("");

  // ─── Edit state ───
  const [editingId, setEditingId] = useState(null);
  const [editFormat, setEditFormat] = useState("");

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
      toast.error("Lỗi khi lấy danh sách môn học");
    }
  };

  const getClassOptions = async (subjId) => {
    try {
      const res = await api.get(`/api/v1/assignment/class/${subjId}`);
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

  useEffect(() => {
    const fetchAssigned = async () => {
      if (subject_id && class_id) {
        try {
          const res = await api.get("/api/v1/exam-assignment/", {
            params: { subject_id, class_id },
          });
          if (res.data.length) setAssignedList(res.data);
          else setAssignedList([]), toast.info("Không tìm thấy hình thức thi");
        } catch (err) {
          console.error(err);
          toast.error("Lỗi khi lấy danh sách hình thức thi");
        }
      }
    };
    fetchAssigned();
  }, [subject_id, class_id]);

  // ─── Handlers ───
  const handleSearch = (e) => {
    e.preventDefault();
    if (!subject_id || !class_id)
      return toast.warn("Chọn môn và lớp để tìm kiếm");
    // triggers useEffect
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
    const fetchModalAssignId = async () => {
      if (modalSubjectId && modalClassId) {
        try {
          const id = await getAssignId(modalSubjectId, modalClassId);
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
      message: `Môn: ${modalSubjectId}\nLớp: ${modalClassId}\nHình thức: ${modalExamFormat}`,
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
            placeholder="Chọn môn học"
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
              <strong>Môn học: </strong>
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
                  >
                    Lưu
                  </button>
                  <button onClick={() => setEditingId(null)}>Hủy</button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(item.exSchedule_id);
                    setEditFormat(item.exam_format);
                  }}
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
          <form onSubmit={handleAddClick}>
            <Select
              options={subjectOptions}
              onChange={(opt) => {
                setModalSubjectId(opt?.value || "");
                setModalClassId("");
              }}
              placeholder="Chọn môn học"
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
