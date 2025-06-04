import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: '',
    birthday: '',
    gender: '',
    party_join_date: '',
    professional_level: '',
    title: '',
    agency_id: '',
    plan_title: '',
    course_id: '',
    class_id: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/student/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          ...data,
          birthday: data.birthday?.slice(0, 10) || '',
          party_join_date: data.party_join_date?.slice(0, 10) || ''
        });
      })
      .catch(() => {
        alert('Không tìm thấy học viên');
        navigate('/students/search');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/v1/student/${id}`, formData)
      .then(() => {
        alert('Cập nhật thành công!');
        navigate('/students/search');
      })
      .catch(() => {
        alert('Cập nhật thất bại!');
      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sửa thông tin học viên</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Họ tên</label>
          <input name="student_name" value={formData.student_name} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Ngày sinh</label>
          <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Giới tính</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2">
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Ngày vào Đảng</label>
          <input type="date" name="party_join_date" value={formData.party_join_date} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Trình độ chuyên môn</label>
          <input name="professional_level" value={formData.professional_level} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Chức vụ</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Mã cơ quan</label>
          <input name="agency_id" value={formData.agency_id} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Tên kế hoạch học tập</label>
          <input name="plan_title" value={formData.plan_title} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Mã khóa học</label>
          <input name="course_id" value={formData.course_id} onChange={handleChange} className="w-full border p-2" />
        </div>
        <div>
          <label className="block font-medium">Mã lớp</label>
          <input name="class_id" value={formData.class_id} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
