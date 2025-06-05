import React, { useState,useEffect } from 'react';
import api from '../api.js'
import { useParams } from 'react-router-dom';

function StudentInfoPage () {
    const [studentInfo, setStudentInfo] = useState(null);
    const { student_id } = useParams();
    const[showEdit,setShowEdit] = useState(false);

    const OpenEdit = ()=>{
        setShowEdit(true);
    }

    const CloseEdit = ()=>{
        setShowEdit(false);
    }

    // const handleEdit = (e)=>{
    //     e.preventDefault();
    //     // Gửi yêu cầu PUT để cập nhật thông tin học viên
    //     api.put(`/api/v1/student/edit/${student_id}`)
    //     .then((res)=>res.data)
    //     .then((data)=>{
    //         setStudentInfo(data);
    //         console.log('Cập nhật thông tin học viên thành công', data);
    //     })
    // }
    setShowEdit(false); // Ẩn form chỉnh sửa sau khi lưu

    useEffect(() => {
        api.get(`/api/v1/student/${student_id}`)
        .then((res)=>res.data)
        .then((data)=>{
            setStudentInfo(data);
            console.log(data);
        })
        .catch((err)=>{
            console.log('Lỗi khi lấy thông tin học viên', err);
        })
    }, [student_id]);

    return(
       <div className='student-info-card'>
            <div className='detail-card'>
                <h2>Thông tin sinh viên</h2>
                <p>Họ tên: {studentInfo?.student_name}</p>
                <p>Mã học viên: {studentInfo?.student_id}</p>
                <p>Ngày sinh: {studentInfo?.birthday}</p>
                <p>Giới tính: {studentInfo?.gender}</p>
                <p>Lớp: {studentInfo?.class_name}</p>
                <p>Khoá học: {studentInfo?.course_name}</p>
                <p>Đơn vị: {studentInfo?.agency_name}</p>
                <p>Chức vị: {studentInfo.professional_level}</p>
                <p>Ngày kết nạp: {studentInfo?.party_join_date}</p>
                <p>Tiêu đề kế hoạch: {studentInfo?.plan_title}</p>
                <p>Barcode: {studentInfo?.barcode}</p>

                <button onClick={OpenEdit}>Sửa</button>
                <button>Kết quả học tập</button>
            </div>
            {showEdit &&(
                <div className='edit-card'>
                    <button >Lưu</button>
                    <button onClick={CloseEdit}>Huỷ</button>
                </div>
            )}
            
       </div>
    )
}

export default StudentInfoPage;