import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/subjectComponent';
import AddSubject from './pages/addSubject';
import EditSubject from './pages/editSubject';

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
}

export default App;
