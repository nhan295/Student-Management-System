import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout";

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
import GraduateCertPage from "./pages/GraduateCertPage";
import WarningsPage from "./pages/WarningsPage";
import WarningsDetailPage from "./pages/WarningsDetailPage";

function App() {
  return (
    <Routes>
      {/* Route không dùng layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

      {/* Route dùng layout */}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/homepage" replace />} />

        <Route path="subjects/list" element={<SubjectPage />} />
        <Route path="subjects/add" element={<AddSubject />} />
        <Route path="subjects/edit/:id" element={<EditSubject />} />

        <Route path="classes/search" element={<ClassList />} />
        <Route path="schedules" element={<SchedulePage />} />

        <Route path="students" element={<StudentPage />} />
        <Route path="student/search" element={<SearchStudentPage />} />
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
      </Route>

      {/* Redirect các route không khớp */}
      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}

export default App;
