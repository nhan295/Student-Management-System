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


function App() {
  return (
    <Routes>
      {/* Đường dẫn bình thường */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

      {/* Đường dẫn có layout và sidebar */}
      <Route element={<Layout />}>
        {/* Đổi index route thành homepage hoặc danh sách học viên */}
        <Route index element={<Navigate to="/homepage" replace />} />


      <Route element={<Layout />}>
        <Route index element={<Navigate to="/homepage" replace />} />

        <Route path="subjects/list" element={<SubjectPage />} />
        <Route path="subjects/add" element={<AddSubject />} />
        <Route path="subjects/edit/:id" element={<EditSubject />} />

        <Route path="classes/search" element={<ClassList />} />
        <Route path="schedules" element={<SchedulePage />} />


        {/* Routes cho học viên */}
        <Route path="students" element={<StudentPage />} />
      </Route>

      {/* Nếu không khớp đường dẫn nào thì chuyển về homepage */}

        <Route path="/student/search" element={<SearchStudentPage />} />
        <Route
          path="/student/detail/:student_id"
          element={<StudentInfoPage />}
        />
      </Route>


      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}


export default App;



