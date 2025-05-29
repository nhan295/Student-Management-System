import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Layout      from './components/subjectComponent';
import AddSubject  from './pages/addSubject';
import EditSubject from './pages/editSubject';
import HomePage    from './pages/HomePage';
import LoginPage   from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* những route không có header/sidebar */}
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />

        {/* tất cả route còn lại dùng chung Layout */}
        <Route element={<Layout />}>
          <Route path="/"                     element={<Navigate to="subjects/add" replace />} />
          <Route path="subjects/add"          element={<AddSubject />} />
          <Route path="subjects/edit/:id"     element={<EditSubject />} />
          {/* nếu có thêm pages khác cũng đặt ở đây */}
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;