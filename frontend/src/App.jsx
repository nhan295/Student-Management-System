import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/subjectComponent';
import AddSubject from './pages/addSubject';
import EditSubject from './pages/editSubject';

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/subjects/add" />} />
        <Route path="/subjects/add" element={<AddSubject />} />
        <Route path="/subjects/edit/:id" element={<EditSubject />} />
      </Routes>
    </Layout>
  );
    <BrowserRouter>
      <Routes>
        <Route path="/homepage" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
