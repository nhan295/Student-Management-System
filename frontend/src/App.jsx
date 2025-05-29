import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

 import Layout      from './components/layout';
 import AddSubject  from './pages/addSubject';
 import EditSubject from './pages/editSubject';
 import HomePage    from './pages/HomePage';
 import LoginPage   from './pages/LoginPage';

 function App() {

  return (
    <Routes>
      {/*Đường dẫn bình thường*/}
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/homepage" element={<HomePage />} />

     {/*Đường dẫn có layout và sidebar*/}
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

