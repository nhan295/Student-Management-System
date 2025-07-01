import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import AddSubject from "./pages/AddSubjectPage";
import EditSubject from "./pages/EditSubjectPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SubjectPage from "./pages/SubjectPage";
import ClassList from "./components/ClassList";
import SchedulePage from "./pages/SchedulePage";

import StudentPage from "./pages/StudentPage";
import SearchStudentPage from "./pages/SearchStudentPage";
import StudentInfoPage from "./pages/StudentInfoPage";

import ExamAssignmentPage from "./pages/ExamAssignmentPage";

import GraduateCertPage from "./pages/GraduateCertPage";
import WarningsPage from "./pages/WarningsPage";
import WarningsDetailPage from "./pages/WarningsDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AttendancePage from "./pages/AttendancePage";

import React, { useState } from "react";
function App() {
  const [authKey, setAuthKey] = useState(Date.now());

  const handleLogout = () => {
    localStorage.clear();
    setAuthKey(Date.now());
  };
  return (
    <Routes>
      {/* Route không dùng layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/homepage"
        element={
          <ProtectedRoute key={authKey}>
            <HomePage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Route dùng layout */}

      <Route
        element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="subjects/list" element={<SubjectPage />} />
        <Route path="subjects/add" element={<AddSubject />} />
        <Route path="subjects/edit/:id" element={<EditSubject />} />

        <Route path="classes/search" element={<ClassList />} />
        <Route path="schedules" element={<SchedulePage />} />

        <Route path="students" element={<StudentPage/>} />
        <Route path="student/search" element={<SearchStudentPage />} />

        <Route
          path="student/detail/:student_id"
          element={<StudentInfoPage />}
        />

        <Route
          path="student/detail/:student_id"
          element={<StudentInfoPage />}
        />
        <Route path="/cert/search" element={<GraduateCertPage />} />

        <Route path="warnings" element={<WarningsPage />} />
        <Route
          path="/warnings/class/:classId/subject/:subjectId"
          element={<WarningsDetailPage />}
        />
        <Route path="/exam-assign" element={<ExamAssignmentPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
