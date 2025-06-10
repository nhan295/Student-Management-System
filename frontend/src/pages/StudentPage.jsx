import { useEffect, useState } from 'react';
import axios from 'axios';
import AddStudentForm from '../components/AddStudentForm';
import StudentList from '../components/StudentList';
import "../styles/Students.css";

function StudentPage() {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); 

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:3000/api/v1/courses');
    setCourses(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get('http://localhost:3000/api/v1/classes/all-classes');
    setClasses(res.data);
  };

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  return (
    <div>
      <h2>Quản lý sinh viên</h2>
      <div>
      <button className="btn-add-student" onClick={() => setActiveTab('add')}>Thêm sinh viên</button>
      </div>

      {activeTab === 'add' && (
        <AddStudentForm courses={courses} fetchCourses={fetchCourses} onStudentAdded={() => {}} />
      )}

      {activeTab === 'list' && (
        <StudentList courses={courses} classes={classes} />
      )}
    </div>
  );
}

export default StudentPage;
