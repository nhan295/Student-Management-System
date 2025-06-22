import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Students.css";

function StudentList() {
  const [classId, setClassId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);

  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/classes/all-classes")
      .then((res) => setClasses(res.data));
    axios
      .get("http://localhost:3000/api/v1/courses")
      .then((res) => setCourses(res.data));
  }, []);

  useEffect(() => {
    // Cập nhật danh sách lớp dựa trên courseId được chọn
    const filtered = classes.filter(
      (cls) => cls.course_id === Number(courseId)
    );
    setFilteredClasses(filtered);
    setClassId(""); // reset classId khi chọn lại khóa học
  }, [courseId, classes]);

  const fetchStudents = async () => {
    if (!courseId || !classId) {
      alert("Vui lòng chọn đầy đủ khóa học và lớp học");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/v1/students", {
        params: { classId, courseId },
      });
      setStudents(res.data);
    } catch (error) {
      alert("Lỗi khi lấy danh sách sinh viên");
      console.error(error);
    }
  };

  const getClassName = (id) => {
    const cls = classes.find((c) => c.class_id === id);
    return cls ? cls.class_name : "Không rõ";
  };

  const getCourseName = (id) => {
    const course = courses.find((c) => c.course_id === id);
    return course ? course.course_name : "Không rõ";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không rõ";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="student-list-container">
      <h3>Danh sách học viên</h3>

      <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        <option value="">-- Chọn niên khóa --</option>
        {courses.map((c) => (
          <option key={c.course_id} value={c.course_id}>
            {c.course_name} ({c.start_year} - {c.end_year})
          </option>
        ))}
      </select>

      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        disabled={!courseId}
      >
        <option value="">-- Chọn lớp học --</option>
        {filteredClasses.map((cls) => (
          <option key={cls.class_id} value={cls.class_id}>
            {cls.class_name}
          </option>
        ))}
      </select>

      <button onClick={fetchStudents} disabled={!classId || !courseId}>
        Hiển thị
      </button>

      {students.length === 0 ? (
        <p>Chưa có dữ liệu hiển thị</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Mã học viên</th>
              <th>Họ tên</th>
              <th>Năm sinh</th>
              <th>Giới tính</th>
              <th>Ngày vào Đảng</th>
              <th>Trình độ học vấn</th>
              <th>Trình độ chuyên môn</th>
              <th>Chức vụ</th>
              <th>Đơn vị công tác</th>
              <th>Niên khóa</th>
              <th>Lớp</th>
            </tr>
          </thead>

          <tbody>
  {students.map((s) => (
    <tr key={s.student_id}>
      <td>{s.student_id}</td>
      <td>{s.student_name}</td>
      <td>{formatDate(s.birthday)}</td>
      <td>{s.gender}</td>
      <td>{formatDate(s.party_join_date)}</td>
      <td>{s.education_level || "Không rõ"}</td>
      <td>{s.professional_level || "Không rõ"}</td>
      <td>{s.title || "Không rõ"}</td>
      <td>{s.agency_name || "Không rõ"}</td>
      <td>{getCourseName(s.course_id)}</td>
      <td>{getClassName(s.class_id)}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}

export default StudentList;
