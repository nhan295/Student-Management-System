// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ConfirmDialog from "../components/FormDialog";
// import "../styles/SubjectPage.css";

// const PAGE_SIZE = 5;

// export default function SubjectPage() {
//   const [subjects, setSubjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [query, setQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [confirmParams, setConfirmParams] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     onConfirm: null,
//   });

//   const navigate = useNavigate();

//   // Load danh sách
//   const fetchSubjects = async () => {
//     try {
//       const resp = await axios.get("http://localhost:3000/api/v1/subjects");
//       setSubjects(resp.data);
//     } catch (err) {
//       console.error(err);
//       alert("Lỗi khi tải danh sách học phần");
//     }
//   };
//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   // Reset page khi query (kết quả mới) thay đổi
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [query]);

//   // Mở dialog xác nhận
//   const openConfirm = ({ title, message, onConfirm }) => {
//     setConfirmParams({ isOpen: true, title, message, onConfirm });
//   };
//   const closeConfirm = () => {
//     setConfirmParams((cp) => ({ ...cp, isOpen: false }));
//   };

//   // Thực sự xóa
//   const performDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/subjects/${id}`);
//       fetchSubjects();
//     } catch (err) {
//       console.error(err);
//       alert("Xóa thất bại");
//     }
//   };

//   // Handler nút tìm
//   const handleSearch = () => {
//     setQuery(searchTerm.trim());
//   };
//   const filtered = subjects.filter((s) => {
//     if (!query) return true;
//     const q = query.toLowerCase();
//     return (
//       s.subject_code.toLowerCase().includes(q) ||
//       s.subject_name.toLowerCase().includes(q)
//     );
//   });
//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const startIdx = (currentPage - 1) * PAGE_SIZE;
//   const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
//   const blanksCount = PAGE_SIZE - paginated.length;

//   return (
//     <div className="subject-page">
//       <div className="search-bar">
//         <label>Mã số hoặc tên HP:</label>
//         <input
//           type="text"
//           placeholder="Nhập từ khóa..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               handleSearch();
//             }
//           }}
//         />
//         <button onClick={handleSearch}>🔍 Tìm</button>
//       </div>

//       <h2 className="page-title">Danh mục học phần</h2>

//       <table className="subject-table">
//         <colgroup>
//           <col style={{ width: "8%" }} />
//           <col style={{ width: "15%" }} />
//           <col style={{ width: "45%" }} />
//           <col style={{ width: "12%" }} />
//           <col style={{ width: "10%" }} />
//           <col style={{ width: "10%" }} />
//         </colgroup>
//         <thead>
//           <tr>
//             <th>STT</th>
//             <th>Mã HP</th>
//             <th>Tên học phần</th>
//             <th>Tổng số tiết</th>
//             <th>Sửa</th>
//             <th>Xóa</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginated.map((s, idx) => (
//             <tr key={s.subject_id} className={idx % 2 === 1 ? "odd" : ""}>
//               <td>{startIdx + idx + 1}</td>
//               <td>{s.subject_code}</td>
//               <td>{s.subject_name}</td>
//               <td>{s.total_lessons}</td>
//               <td>
//                 <button
//                   className="btn-edit"
//                   onClick={() => navigate(`/subjects/edit/${s.subject_id}`)}
//                 >
//                   Sửa
//                 </button>
//               </td>
//               <td>
//                 <button
//                   className="btn-delete"
//                   onClick={() =>
//                     openConfirm({
//                       title: "Xác nhận xóa",
//                       message: `Bạn có chắc muốn xóa học phần:\nMã: ${s.subject_code}\nTên: ${s.subject_name}`,
//                       onConfirm: async () => {
//                         await performDelete(s.subject_id);
//                         closeConfirm();
//                       },
//                     })
//                   }
//                 >
//                   Xóa
//                 </button>
//               </td>
//             </tr>
//           ))}

//           {Array.from({ length: blanksCount }).map((_, i) => (
//             <tr key={`blank-${i}`} className="blank-row">
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//               <td>&nbsp;</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="pagination">
//         <button
//           onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//           disabled={currentPage === 1}
//         >
//           ‹ Trước
//         </button>
//         <span>
//           Trang {currentPage} / {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//           disabled={currentPage === totalPages}
//         >
//           Tiếp ›
//         </button>
//       </div>

//       <div className="add-button-container">
//         <button className="btn-add" onClick={() => navigate("/subjects/add")}>
//           Thêm học phần
//         </button>
//       </div>

//       {/* Dialog xác nhận */}
//       <ConfirmDialog
//         isOpen={confirmParams.isOpen}
//         title={confirmParams.title}
//         message={confirmParams.message}
//         onConfirm={confirmParams.onConfirm}
//         onCancel={closeConfirm}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/FormDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SubjectPage.css";

const PAGE_SIZE = 5;

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();

  // Load danh sách
  const fetchSubjects = async () => {
    try {
      const resp = await axios.get("http://localhost:3000/api/v1/subjects");
      setSubjects(resp.data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải danh sách học phần");
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Reset page khi query (kết quả mới) thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Mở dialog xác nhận
  const openConfirm = ({ title, message, onConfirm }) => {
    setConfirmParams({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () => {
    setConfirmParams((cp) => ({ ...cp, isOpen: false }));
  };

  // Thực sự xóa
  const performDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/subjects/${id}`);
      fetchSubjects();
      toast.success("Xóa học phần thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Học phần đang được sử dụng, không thể xóa");
    }
  };

  // Handler nút tìm
  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };
  const filtered = subjects.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.subject_code.toLowerCase().includes(q) ||
      s.subject_name.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const blanksCount = PAGE_SIZE - paginated.length;

  return (
    <div className="subject-page">
      <div className="search-bar">
        <label>Mã số hoặc tên HP:</label>
        <input
          type="text"
          placeholder="Nhập từ khóa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>🔍 Tìm</button>
      </div>

      <h2 className="page-title">Danh mục học phần</h2>

      <table className="subject-table">
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "45%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã HP</th>
            <th>Tên học phần</th>
            <th>Tổng số tiết</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((s, idx) => (
            <tr key={s.subject_id} className={idx % 2 === 1 ? "odd" : ""}>
              <td>{startIdx + idx + 1}</td>
              <td>{s.subject_code}</td>
              <td>{s.subject_name}</td>
              <td>{s.total_lessons}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/subjects/edit/${s.subject_id}`)}
                >
                  Sửa
                </button>
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() =>
                    openConfirm({
                      title: "Xác nhận xóa",
                      message: `Bạn có chắc muốn xóa học phần:\nMã: ${s.subject_code}\nTên: ${s.subject_name}`,
                      onConfirm: async () => {
                        await performDelete(s.subject_id);
                        closeConfirm();
                      },
                    })
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {Array.from({ length: blanksCount }).map((_, i) => (
            <tr key={`blank-${i}`} className="blank-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ‹ Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Tiếp ›
        </button>
      </div>

      <div className="add-button-container">
        <button className="btn-add" onClick={() => navigate("/subjects/add")}>
          Thêm học phần
        </button>
      </div>

      {/* Dialog xác nhận */}
      <ConfirmDialog
        isOpen={confirmParams.isOpen}
        title={confirmParams.title}
        message={confirmParams.message}
        onConfirm={confirmParams.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Toast notification */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />
    </div>
  );
}
