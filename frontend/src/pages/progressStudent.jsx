import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentProgress = () => {
  const { id } = useParams();
  const [scores, setScores] = useState([]);
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/student/${id}`)
      .then(res => setStudentName(res.data.student_name))
      .catch(() => setStudentName('Không xác định'));

    axios.get(`http://localhost:3000/api/v1/student/${id}/progress`)
      .then(res => setScores(res.data))
      .catch(() => alert('Không thể lấy điểm học viên'));
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tên học viên: {studentName}</h2>

      <table className="w-full text-sm border border-blue-400">
        <thead className="bg-blue-200 text-center">
          <tr>
            <th className="border px-2">STT</th>
            <th className="border px-2">Mã HP</th>
            <th className="border px-2">Tên học phần</th>
            <th className="border px-2">Năm học</th>
            <th className="border px-2">Nhóm</th>
            <th className="border px-2">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="border">{index + 1}</td>
              <td className="border">{row.subject_code}</td>
              <td className="border text-left">{row.subject_name}</td>
              <td className="border">{row.school_year}</td>
              <td className="border">{row.group_name}</td>
              <td className="border">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          onClick={() => navigate(`/students/score-entry/${id}`)}
        >
          NHẬP ĐIỂM
        </button>
      </div>
    </div>
  );
};

export default StudentProgress;
