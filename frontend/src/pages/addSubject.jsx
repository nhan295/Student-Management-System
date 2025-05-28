import { useState } from 'react';
import axios from 'axios';
import "tailwindcss";


function AddSubject() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/subjects', {
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
  const handleRefresh = () => {
    setSubjectName('');
    setSubjectCode('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-blue-100 border border-blue-300 p-8 rounded-xl shadow-lg">
        <div className="border-2 border-blue-600 p-6 rounded-md bg-white">
          <h2 className="text-xl font-bold text-center mb-6">Thêm học phần</h2>
          <form onSubmit={handleSubmit} className="space-y-4 w-72">
            <div>
              <label className="block mb-1">Tên học phần:</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Mã số học phần:</label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Refresh
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSubject;
