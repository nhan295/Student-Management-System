import '../styles/ShowAssign.css'; 
import { useState } from 'react';

function ShowAssign({ assignment, onDelete, onEdit, lecturerOptions = [], subjectOptions = [], classOptions = [] }) {
  // state để lưu assignment hiện tại đang chỉnh sửa
  const [showEditModal, setShowEditModal] = useState(false);

  const [editLecturer, setEditLecturer] = useState(assignment.lecturer_id);
  const [editSubject, setEditSubject] = useState(assignment.subject_id);
  const [editClass, setEditClass] = useState(assignment.class_id);

  const OpenEdit = () => {
    setEditLecturer(assignment.lecturer_id);  // gán giá trị ban đầu cho các trường chỉnh sửa
    setEditSubject(assignment.subject_id);
    setEditClass(assignment.class_id);  
    setShowEditModal(true);    // hiển thị modal chỉnh sửa
  }

  const CloseEdit = () => setShowEditModal(false);    // ẩn modal chỉnh sửa
  
  const handleEdit = (e) => {
    e.preventDefault();  // ngăn chặn hành động mặc định của form
    if(onEdit) {   // nếu có hàm onEdit được truyền từ cha thì gọi hàm onEdit với id của assignment và các giá trị đã chỉnh sửa
      onEdit(assignment.id,{  // gửi dữ liệu chỉnh sửa lên cha là AssignmentPage
        lecturer_id: editLecturer,
        subject_id: editSubject,
        class_id: editClass
      });
    }
    setShowEditModal(false);  // ẩn modal sau khi chỉnh sửa
  }
  return (
    <div className="assignment-card">
        <h3>Phân công</h3>
        <div className="assign-container">
            <p><strong>Giảng viên:</strong> {assignment.lecturer_name}</p>
            <p><strong>Mã giảng viên:</strong> {assignment.lecturer_id}</p>
            <p><strong>Môn học:</strong> {assignment.subject_name}</p>
            <p><strong>Lớp học:</strong> {assignment.class_name}</p>
            <p><strong>Khoá:</strong>{assignment.course_name}</p>
            <div style={{marginTop: '10px'}}>
                <button className="edit-btn" onClick={OpenEdit}>Sửa</button>
                <button className="delete-btn" onClick={() => onDelete && onDelete(assignment.id)}>Xoá</button>
            </div>
        </div>

        {showEditModal && (
        <div className='edit-cart'>
          <div className='modal-overlay'>
            <div className='modal-content'>
              <form onSubmit={handleEdit}>
                <label htmlFor="">Sửa</label>
                <label htmlFor="">Giảng viên</label>
                <select value={editLecturer}
                  onChange={(e)=>setEditLecturer(e.target.value)}>
                    <option value="">Chọn giảng viên</option>
                    {lecturerOptions.map(opt=>(
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <label htmlFor="">Môn học</label>
                <select value={editSubject}
                  onChange={(e)=>setEditSubject(e.target.value)}>
                  <option value="">Chọn môn học</option>
                  {subjectOptions.map(opt=>(
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <label htmlFor="">Lớp học</label>
                <select value={editClass}
                onChange={(e)=>setEditClass(e.target.value)}>
                  <option value="">Chọn lớp học</option>
                  {classOptions.map(opt=>(
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button type="submit">Lưu</button>
                <button onClick={CloseEdit}>Huỷ</button>
              </form>
            </div>
          </div>
        </div>
        )} 
    </div>
    
  );
  }
export default ShowAssign;