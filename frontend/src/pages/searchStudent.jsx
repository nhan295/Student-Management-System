import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SearchStudent = () => {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/v1/student/search?name=${name}`);
      setResults(response.data);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm học viên:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tìm kiếm học viên</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên học viên"
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tìm
        </button>
      </div>

      {loading ? (
        <p>Đang tìm kiếm...</p>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {results.map((student) => (
            <div
              key={student.student_id}
              className="border border-gray-300 rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50"
            >
              <div className="space-y-1 text-sm">
                <p><strong>Họ và tên:</strong> {student.student_name}</p>
                <p><strong>Mã học viên:</strong> {student.student_id}</p>
                <p><strong>Giới tính:</strong> {student.gender}</p>
                <p><strong>Ngày sinh:</strong> {formatDate(student.birthday)}</p>
                <p><strong>Khóa học:</strong> {student.course_id}</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-4">
                <button
                  onClick={() => navigate(`/students/edit/${student.student_id}`)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  SỬA
                </button>
                <button
                  onClick={() => navigate(`/students/progress/${student.student_id}`)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                >
                  TIẾN ĐỘ HỌC TẬP
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Không có kết quả phù hợp với từ khóa "<strong>{name}</strong>"</p>
      )}
    </div>
  );
};

export default SearchStudent;
