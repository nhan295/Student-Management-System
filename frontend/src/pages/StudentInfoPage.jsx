import React, { useState,useEffect } from 'react';
import api from '../api.js'
import { useParams } from 'react-router-dom';


function StudentInfoPage () {
    const [studentInfo, setStudentInfo] = useState(null);
    const { student_id } = useParams();
    const[showEdit,setShowEdit] = useState(false);
   
    const [studentName, setStudentName] = useState(studentInfo?.student_name || '');
    const [professionalLevel, setProfessionalLevel] = useState(studentInfo?.professional_level || '');
    const [partyJoinDate, setPartyJoinDate] = useState(studentInfo?.party_join_date || '');
    const[planTitle, setPlanTitle] = useState(studentInfo?.plan_title || '');

    const OpenEdit = ()=>{
        setStudentName(studentInfo?.student_name || ''); // Lấy tên học viên từ thông tin hiện tại
        //setBirthday(studentInfo?.birthday || ''); // Lấy ngày sinh từ thông tin hiện tại
        setProfessionalLevel(studentInfo?.professional_level || ''); // Lấy chức vị từ thông tin hiện tại   
        setPartyJoinDate(studentInfo?.party_join_date || ''); // Lấy ngày kết nạp từ thông tin hiện tại
        setPlanTitle(studentInfo?.plan_title || ''); // Lấy tiêu đề kế hoạch từ thông tin hiện tại
        // Đặt giá trị ban đầu cho các trường chỉnh sửa
        setShowEdit(true);
    }

    const CloseEdit = ()=>{
        setShowEdit(false);
    }

    const handleEdit = (e)=>{
        e.preventDefault();
        // Gửi yêu cầu PUT để cập nhật thông tin học viên
        api.put(`/api/v1/student/edit/${student_id}`,{
        
            student_name: studentName,
            // birthday: birthday,
            
            professional_level: professionalLevel,
            party_join_date: partyJoinDate,
            plan_title: planTitle
        })
        
        .then((res)=>res.data)
        .then((data)=>{
            setStudentInfo(data);
            // Cập nhật lại các state form để đồng bộ với dữ liệu mới
           
            setStudentName(data.student_name || '');
            //setBirthday(data.birthday || '');
           
            setProfessionalLevel(data.professional_level || '');
            setPartyJoinDate(data.party_join_date || '');
            setPlanTitle(data.plan_title || '');
            console.log('Cập nhật thông tin học viên thành công', data);
            setShowEdit(false); // Ẩn form chỉnh sửa sau khi lưu
        })
        .catch((err)=>{
             console.log('Lỗi khi cập nhật thông tin học viên', err.response?.data || err.message);
        })
    }

    //  const getClassList = () => {
    //     api.get("/api/v1/classes/all-classes")
    //       .then((res) => {
    //         const classOptions = res.data.map((c) => ({
    //           value: c.class_id,
    //           label: `${c.class_name}`,
    //           course_id: c.course_id, // Lưu cả course_id vào option
    //           course_name: c.course_name // Lưu cả tên khoá
    //         }));
    //         setClassOptions(classOptions);
    //         // Tạo danh sách khoá học duy nhất từ dữ liệu lớp
    //         const uniqueCourses = Array.from(
    //           new Map(res.data.map((c) => [c.course_id, { value: c.course_id, label: c.course_name }])).values()
    //         );
    //         setCourseOptions(uniqueCourses);
    //       });
    //   };

    // // Khi chọn lớp, tự động nhảy khoá
    // const handleClassChange = (e) => {
    //     const selectedClassId = e.target.value;
    //     setClassId(selectedClassId);
    //     // Tìm class option tương ứng để lấy course_id
    //     const selectedClass = classOptions.find((c) => c.value === selectedClassId);
    //     if (selectedClass) {
    //       setCourseId(selectedClass.course_id);
    //     }
    //   };

    useEffect(() => {
        // Gọi lấy danh sách lớp khi mount
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
                <p>Ngày sinh: {studentInfo?.birthday ? new Date(studentInfo.birthday).toISOString().slice(0, 10) : ''}</p>
                <p>Giới tính: {studentInfo?.gender}</p>
                <p>Lớp: {studentInfo?.class_name}</p>
                <p>Khoá học: {studentInfo?.course_name}</p>
                <p>Đơn vị: {studentInfo?.agency_name}</p>
                <p>Chức vị: {studentInfo?.professional_level}</p>
                <p>Ngày kết nạp: {studentInfo?.party_join_date}</p>
                <p>Tiêu đề kế hoạch: {studentInfo?.plan_title}</p>
                <p>Barcode: {studentInfo?.barcode}</p>

                <button onClick={OpenEdit}>Sửa</button>
                <button>Kết quả học tập</button>
            </div>
            {showEdit &&(
                <div className='edit-card'>
                    <form onSubmit={handleEdit}>
                        <label htmlFor="student_name">Họ tên:</label>
                        <input type="text" 
                        id="student_name"
                         defaultValue={studentInfo?.student_name} 
                         onChange={e=>setStudentName(e.target.value)}
                         value={studentName}/>
                        
                        

                       

                        <label htmlFor="">Chức vị</label>
                        <input 
                        type="text"
                        onChange={e=>setProfessionalLevel(e.target.value)}
                        value={professionalLevel} />

                        <label htmlFor="">Ngày kết nạp</label>
                        <input type="text"
                        onChange={e=>setPartyJoinDate(e.target.value)}
                        value={partyJoinDate} />

                        <label htmlFor="">Tiêu đề kế hoạch</label>
                        <input type="text"
                        onChange={e=>setPlanTitle(e.target.value)}
                        value={planTitle}
                        />

                       
                        <button type='submit'>Lưu</button>
                        <button onClick={CloseEdit}>Huỷ</button>
                    </form>
                </div>
            )}
            
       </div>
    )
}

export default StudentInfoPage;