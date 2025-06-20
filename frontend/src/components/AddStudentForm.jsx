import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Students.css";

function AddStudentForm() {
  const [form, setForm] = useState({
    student_id: "",
    student_name: "",
    birthday: "",
    education_level: "", 
    gender: "",
    party_join_date: "",
    professional_level: "",
    title: "",
    agency_name: "",
    plan_title: "",
    barcode: "",
    course_id: "",
    class_id: "",
  });
  

  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);

  const [newCourse, setNewCourse] = useState({
    course_name: "",
    start_year: "",
    end_year: "",
  });

  const [newClass, setNewClass] = useState({
    class_id: "",
    class_name: "",
    course_id: "",
    total_student: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/students/courses"
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khóa học:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/classes/all-classes"
      );
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (e) => {
    const selectedCourseId = e.target.value;
    setForm((prev) => ({ ...prev, course_id: selectedCourseId, class_id: "" }));
    const filtered = classes.filter(
      (cls) => cls.course_id === Number(selectedCourseId)
    );
    setFilteredClasses(filtered);
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
      await axios.post("http://localhost:3000/api/v1/students", form);
      alert("Thêm sinh viên thành công!");
      setForm({
        student_id: "",
        student_name: "",
        birthday: "",
        gender: "",
        party_join_date: "",
        professional_level: "",
        title: "",
        agency_name: "",
        plan_title: "",
        barcode: "",
        course_id: "",
        class_id: "",
      });
    } catch (err) {
      console.error("Lỗi từ backend:", err.response?.data || err.message);
      alert("Lỗi khi thêm sinh viên!");
    }
  };

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewCourse = async () => {
    const { course_name, start_year, end_year } = newCourse;
    if (!course_name || !start_year || !end_year) {
      alert("Vui lòng điền đầy đủ thông tin khóa học mới.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/v1/courses", newCourse);
      alert("Thêm khóa học mới thành công!");
      setNewCourse({ course_name: "", start_year: "", end_year: "" });
      fetchCourses();
      setShowCourseForm(false);
    } catch (err) {
      console.error("Lỗi khi thêm khóa học mới:", err);
      alert("Không thể thêm khóa học mới.");
    }
  };

  const handleAddNewClass = async () => {
    const { class_id, class_name, course_id, total_student } = newClass;
  
    if (!class_id || !class_name || !course_id || !total_student) {
      alert("Vui lòng điền đầy đủ thông tin lớp học mới.");
      return;
    }
  
    const idNumber = Number(class_id);
    if (isNaN(idNumber) || idNumber <= 0) {
      alert("Mã lớp học không hợp lệ.");
      return;
    }
  
    try {
      const payload = {
        class_id: idNumber,
        class_name,
        course_id: Number(course_id),
        total_student: Number(total_student),
      };
  
      await axios.post("http://localhost:3000/api/v1/classes", payload);

  
      alert("Thêm lớp học mới thành công!");
      setNewClass({
        class_id: "",
        class_name: "",
        course_id: "",
        total_student: "",
      });
      fetchClasses();
      setShowClassForm(false);
    } catch (err) {
      console.error("Lỗi khi thêm lớp học mới:", err);
      alert("Không thể thêm lớp học mới.");
    }
  };
  
  

  return (
    <div className="add-student-form-container">
      <h3>Thêm sinh viên mới</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="student_id"
          placeholder="MSSV"
          value={form.student_id}
          onChange={handleInputChange}
        />
        <input
          name="student_name"
          placeholder="Họ và tên"
          value={form.student_name}
          onChange={handleInputChange}
        />

        <input
          name="birthday"
          type={form.birthday ? "date" : "text"}
          value={form.birthday}
          onChange={handleInputChange}
          placeholder="Ngày sinh (mm/dd/yyyy)"
          onFocus={(e) => (e.target.type = "date")}
         
        />

        <select name="gender" value={form.gender} onChange={handleInputChange}>
          <option value="">Giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>

        <input
          name="party_join_date"
          type={form.party_join_date ? "date" : "text"}
          value={form.party_join_date}
          onChange={handleInputChange}
          placeholder="Ngày vào đảng (mm/dd/yyyy)"
          onFocus={(e) => (e.target.type = "date")}
        />
        <input
          name="education_level"
          placeholder="Trình độ học vấn"
          value={form.education_level}
          onChange={handleInputChange}
        />
        <input
          name="professional_level"
          placeholder="Trình độ chuyên môn"
          value={form.professional_level}
          onChange={handleInputChange}
        />
        <input
          name="title"
          placeholder="Chức vụ"
          value={form.title}
          onChange={handleInputChange}
        />
        <input
          name="agency_name"
          placeholder="Cơ quan công tác"
          value={form.agency_name}
          onChange={handleInputChange}
        />
        <input
          name="plan_title"
          placeholder="Chức danh quy hoạch"
          value={form.plan_title}
          onChange={handleInputChange}
        />
        <input
          name="barcode"
          placeholder="Mã vạch"
          value={form.barcode}
          onChange={handleInputChange}
        />

        <select
          name="course_id"
          value={form.course_id}
          onChange={handleCourseSelect}
        >
          <option value="">-- Chọn khóa học --</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name} ({course.start_year} - {course.end_year})
            </option>
          ))}
        </select>

        <select
          name="class_id"
          value={form.class_id}
          onChange={handleInputChange}
          disabled={!form.course_id}
        >
          <option value="">-- Chọn lớp học --</option>
          {filteredClasses.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name}
            </option>
          ))}
        </select>

        <button type="submit">Thêm sinh viên</button>
        <button
          type="button"
          onClick={() => setShowCourseForm(!showCourseForm)}
        >
          {showCourseForm ? "Ẩn form khóa học" : "Thêm khóa học"}
        </button>
        <button type="button" onClick={() => setShowClassForm(!showClassForm)}>
          {showClassForm ? "Ẩn form lớp học" : "Thêm lớp học"}
        </button>
      </form>

      {showCourseForm && (
        <div className="new-course-form">
          <h4>Thêm khóa học mới</h4>
          <input
            name="course_name"
            placeholder="Tên khóa học"
            value={newCourse.course_name}
            onChange={handleNewCourseChange}
          />
          <input
            name="start_year"
            type="number"
            placeholder="Năm bắt đầu"
            value={newCourse.start_year}
            onChange={handleNewCourseChange}
          />
          <input
            name="end_year"
            type="number"
            placeholder="Năm kết thúc"
            value={newCourse.end_year}
            onChange={handleNewCourseChange}
          />
          <button type="button" onClick={handleAddNewCourse}>
            Lưu khóa học
          </button>
        </div>
      )}

      {showClassForm && (
        <div className="new-class-form">
          <h4>Thêm lớp học mới</h4>
          <input
            name="class_id"
            placeholder="Mã lớp học"
            value={newClass.class_id}
            onChange={handleNewClassChange}
          />
          <input
            name="class_name"
            placeholder="Tên lớp học"
            value={newClass.class_name}
            onChange={handleNewClassChange}
          />
          <select
            name="course_id"
            value={newClass.course_id}
            onChange={handleNewClassChange}
          >
            <option value="">-- Chọn khóa học --</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_name} ({course.start_year} - {course.end_year})
              </option>
            ))}
          </select>
          <input
            name="total_student"
            type="number"
            placeholder="Sĩ số lớp"
            value={newClass.total_student}
            onChange={handleNewClassChange}
          />
          <button type="button" onClick={handleAddNewClass}>
            Lưu lớp học
          </button>
        </div>
      )}
    </div>
  );
}

export default AddStudentForm;
