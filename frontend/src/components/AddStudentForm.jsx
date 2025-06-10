import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Students.css";
import { Link } from "react-router-dom";

function AddStudentForm() {
  const [form, setForm] = useState({
    student_id: '',
    student_name: '',
    birthday: '',
    gender: '',
    party_join_date: '',
    professional_level: '',
    title: '',
    agency_name: '',
    plan_title: '',
    barcode: '',
    course_id: '',
    class_id: '',
  });

  const [courses, setCourses] = useState([]);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_name: '',
    start_year: '',
    end_year: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/students/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khóa học:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        alert(`Vui lòng điền đầy đủ thông tin: ${key}`);

        return;
      }
    }

    try {
      await axios.post('http://localhost:3000/api/v1/students', form);
      alert('Thêm sinh viên thành công!');
      setForm({
        student_id: '',
        student_name: '',
        birthday: '',
        gender: '',
        party_join_date: '',
        professional_level: '',
        title: '',
        agency_name: '',
        plan_title: '',
        barcode: '',
        course_id: '',
        class_id: '',
      });
    } catch (error) {
      console.error('Lỗi từ backend:', error.response?.data || error.message);
      alert('Lỗi khi thêm sinh viên!');
    }
  };

  const handleAddNewCourse = async () => {
    if (!newCourse.course_name || !newCourse.start_year || !newCourse.end_year) {
      alert("Vui lòng điền đầy đủ thông tin khóa học mới.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/v1/courses', newCourse);
      alert("Thêm khóa học mới thành công!");
      await fetchCourses();
      setForm({ ...form, course_id: res.data.course_id });
      setNewCourse({ course_name: '', start_year: '', end_year: '' });
      setShowNewCourseForm(false);
    } catch (err) {
      console.error("Lỗi khi thêm khóa học mới:", err);
      alert("Không thể thêm khóa học mới.");
    }
  };

  return (
    <div className="add-student-form-container">
      <h3>Thêm sinh viên mới</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="MSSV" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} />
        <input placeholder="Họ và tên" value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} />
        <input type="date" placeholder="Ngày sinh" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} />
        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input type="date" placeholder="Ngày gia nhập Đảng" value={form.party_join_date} onChange={e => setForm({ ...form, party_join_date: e.target.value })} />
        <input placeholder="Học vấn" value={form.professional_level} onChange={e => setForm({ ...form, professional_level: e.target.value })} />
        <input placeholder="Chức danh" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Cơ quan công tác" value={form.agency_name} onChange={e => setForm({ ...form, agency_name: e.target.value })} />
        <input placeholder="Kế hoạch học tập" value={form.plan_title} onChange={e => setForm({ ...form, plan_title: e.target.value })} />
        <input placeholder="Mã vạch" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />

        <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
          <option value="">-- Chọn khóa học --</option>
          {courses.map(course => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name} ({course.start_year} - {course.end_year})
            </option>
          ))}
        </select>

        <button type="button" onClick={() => setShowNewCourseForm(!showNewCourseForm)}>
          {showNewCourseForm ? "Hủy thêm khóa học" : "Thêm khóa học mới"}
        </button>

        {showNewCourseForm && (
          <div className="new-course-form">
            <h4>Thêm khóa học mới</h4>
            <input placeholder="Tên khóa học" value={newCourse.course_name} onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })} />
            <input type="number" placeholder="Năm bắt đầu" value={newCourse.start_year} onChange={e => setNewCourse({ ...newCourse, start_year: e.target.value })} />
            <input type="number" placeholder="Năm kết thúc" value={newCourse.end_year} onChange={e => setNewCourse({ ...newCourse, end_year: e.target.value })} />
            <button type="button" onClick={handleAddNewCourse}>Lưu khóa học</button>
          </div>
        )}

        <input placeholder="Mã lớp học" value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} />

        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddStudentForm;