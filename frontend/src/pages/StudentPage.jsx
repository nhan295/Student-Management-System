import { useEffect, useState } from "react";
import axios from "axios";
import AddStudentForm from "../components/AddStudentForm";
import StudentList from "../components/StudentList";
import "../styles/Students.css";

function StudentPage() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("list");

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:3000/api/v1/courses");
    setCourses(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/v1/classes/all-classes"
    );
    setClasses(res.data);
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  return (
    <div className="student-page">
      <h2>Quản lý học viên</h2>

      <div className="tab-buttons">
        <button
          className={`btn-tab ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Danh sách học viên
        </button>
        <button
          className={`btn-tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Thêm học viên
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "add" && (
          <AddStudentForm
            courses={courses}
            fetchCourses={fetchCourses}
            onStudentAdded={() => setActiveTab("list")} // quay lại danh sách sau khi thêm
          />
        )}

        {activeTab === "list" && (
          <StudentList courses={courses} classes={classes} />
        )}
      </div>
    </div>
  );
}

export default StudentPage;
