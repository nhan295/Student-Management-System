import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

 import Layout      from './components/subjectComponent';
 import AddSubject  from './pages/addSubject';
 import EditSubject from './pages/editSubject';
 import HomePage    from './pages/HomePage';
 import LoginPage   from './pages/LoginPage';

 function App() {

  return (
    <Routes>
      {/* public */}
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

     {/* protected under common layout */}
      <Route element={<Layout />}>
        <Route index                       element={<Navigate to="subjects/add" replace />} />
        <Route path="subjects/add"         element={<AddSubject />} />
        <Route path="subjects/edit/:id"    element={<EditSubject />} />
      </Route>

     {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
 }

 export default App;
App

