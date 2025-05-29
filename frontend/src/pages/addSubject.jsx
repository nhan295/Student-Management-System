import { useState } from 'react';
import axios from 'axios';
import "tailwindcss";

function AddSubject() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/subjects', {
        subject_name: subjectName,
        subject_code: subjectCode
      });
      alert('Thêm học phần thành công!');
      setSubjectName('');
      setSubjectCode('');
    } catch (err) {
      alert('Lỗi khi thêm học phần');
      console.error(err);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Thêm học phần</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <label style={{ width: 150, fontWeight: 500 }}>Tên học phần:</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Nhập tên học phần"
            style={{
              flex: 1,
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
            required
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }}>
          <label style={{ width: 150, fontWeight: 500 }}>Mã số học phần:</label>
          <input
            type="text"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            placeholder="Nhập mã số học phần"
            style={{
              flex: 1,
              padding: 8,
              border: '1px solid #ccc',
              borderRadius: 4
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '0.75rem 2rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          THÊM
        </button>
      </form>
    </>
  );
}

export default AddSubject;
