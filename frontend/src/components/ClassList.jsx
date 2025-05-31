import React, { useState } from "react";
import axios from "axios";

function ClassList() {
  const [subjectName, setSubjectName] = useState("");
  const [students, setStudents] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/classes/students-by-subject", {
        params: { name: subjectName },
        withCredentials: true,
      });
      console.log("Dữ liệu trả về:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };
  

  return (
    <div>
      <h2>Danh sách điểm theo môn học</h2>
      <input
        type="text"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        placeholder="Nhập tên môn học"
      />
      <button onClick={handleSearch}>Tìm kiếm</button>

      <h3>Kết quả:</h3>
      <ul>
  {students.map((student, index) => (
    <li key={index}>
      {student.subject_name} - {student.student_name} (Mã lớp: {student.class_id}) - Điểm: {student.grade ?? "Chưa có điểm"} 
    </li>
  ))}
</ul>

    </div>
  );
}

export default ClassList;
