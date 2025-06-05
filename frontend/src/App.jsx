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

function App() {
  return (
    <Routes>
      {/*Đường dẫn bình thường*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

      {/*Đường dẫn có layout và sidebar*/}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="subjects/add" replace />} />
        <Route path="subjects/list" element={<SubjectPage />} />
        <Route path="subjects/add" element={<AddSubject />} />
        <Route path="subjects/edit/:id" element={<EditSubject />} />
        <Route path="classes/search" element={<ClassList />} />
        <Route path="schedules" element={<SchedulePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
App;
