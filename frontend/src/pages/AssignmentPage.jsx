import api from '../api';
import { useEffect, useState } from 'react';
import Select from "react-select";
import '../styles/AssignmentPage.css'; 

function Assignment(){
    //thêm vào hàm handleAssign
    const [lecturer_id,setLecturer] = useState("");  
    const [subject_id,setSubject] = useState("");
    const [class_id,setClass] = useState("");
    

    //danh sách options cho select
    const [lecturerOptions, setLecturerOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [classOptions, setClassOptions] = useState([]);
    
    useEffect(()=>{ // khi component mount, gọi các hàm để lấy dữ liệu
        getLecturer();
        getSubject();
        getClassList();
    } ,[]);

    const getLecturer = ()=>{
        api.get("/api/v1/lecturer/")  //lấy danh sách giảng viên
        .then((res)=>{
          
            const lecturerOptions = res.data.map(l=>({  // chuyển đổi dữ liệu thành định dạng phù hợp với react-select
                value: l.lecturer_id,
                label: l.lecturer_name
            }))
            setLecturerOptions(lecturerOptions);  // cập nhật state lecturerOptions
            console.log(lecturerOptions);
        })
        .catch((err)=>{
            console.error('Lỗi khi lấy dữ liệu giảng viên',err)
        })

    };

    const getSubject = ()=>{
        api.get("/api/v1/subjects/")  // lấy danh sách môn học
        .then ((res)=>{
           
            const subjectOptions = res.data.map(s=>({
                value: s.subject_id,
                label: s.subject_name
            }))
            setSubjectOptions(subjectOptions);
            console.log(subjectOptions);
        })
    };
    const getClassList = ()=>{
        api.get("/api/v1/classes/classlist")  // lấy danh sách lớp-khoá
        .then((res)=>{
           
            const classOptions = res.data.map(c=>({
                value: c.class_id,
                label: `${c.class_name} - ${c.course_name}`
            }))
            setClassOptions(classOptions); // cập nhật state classOptions
            console.log(classOptions)
        })
    };
    const handleAssign = (e) =>{
       e.preventDefault();
       console.log(lecturer_id,subject_id,class_id);
       if(!lecturer_id || !subject_id || !class_id){
            alert('Vui lòng chọn đầy đủ thông tin');
            return;
        }
        try{
            api.post("/api/v1/assignment/add",{lecturer_id,subject_id,class_id})
            .then((res)=>{
                if(res.status===200)alert('Assignment created!')
                    else alert('Assignment not create')
            })
        }catch(error){
            console.log(error)
        }
    };
    return(
        <div className='assignment-form-container'>
            <form onSubmit={handleAssign}>
                <h1>➕ Thêm phân công mới</h1>
                <label htmlFor=""> Tên giảng viên</label>
                <Select
                    options={lecturerOptions}
                    // khi chọn giảng viên, cập nhật state lecturer_id
                    onChange={option =>setLecturer(option ? option.value : "")}
                    placeholder="Chọn giảng viên..."
                    isSearchable
                />

                <label htmlFor="">Mã giảng viên</label>
                <input type="text" 
                    readOnly
                    value={lecturer_id}
                    placeholder='Tự động điền khi chọn giảng viên'
                    
                />

                <label htmlFor="">Môn học</label>
                <Select
                    options={subjectOptions}
                    onChange={option => setSubject(option ? option.value : "")}
                    placeholder='Chọn môn học'
                
                />

                <label htmlFor="">Lớp học</label>
                <Select
                    options={classOptions}
                    onChange={option => setClass(option ? option.value : "")}
                    placeholder='Chọn lớp học'
                />

                <button type="submit">Tạo phân công</button>


            </form>
        </div>
    );
}

export default Assignment;

