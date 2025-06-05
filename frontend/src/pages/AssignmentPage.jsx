import api from '../api';
import { useEffect, useState } from 'react';
import Select from "react-select";
import '../styles/AssignmentPage.css'; 
import ShowAssign from '../components/ShowAssign'; 

function Assignment(){
    //thêm vào hàm handleAssign
    const [lecturer_id,setLecturer] = useState("");  
    const [subject_id,setSubject] = useState("");
    const [class_id,setClass] = useState("");
    

    //danh sách options cho select
    const [lecturerOptions, setLecturerOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [classOptions, setClassOptions] = useState([]);

    const [assignedList, setAssignedList] = useState([]); // state để lưu danh sách phân công
    
    useEffect(()=>{ // khi component mount, gọi các hàm để lấy dữ liệu
        getLecturer();
        getSubject();
        getClassList();
        showAssigned(); 
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
        api.get("/api/v1/classes/all-classes")  // lấy danh sách lớp-khoá
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
            api.post("/api/v1/assignment/add",{lecturer_id,subject_id,class_id})
            .then((res)=>{
                if(res.status===200 || res.status===201) {
                    alert('Assignment created!');
                    showAssigned(); // gọi hàm để hiển thị danh sách phân công sau khi thêm mới
                } else {
                    alert('Assignment not created');
                }
            })
            .catch((error) => {
                if (error.response && (error.response.status === 500 || error.response.status === 409)) {
                    alert('Phân công này đã tồn tại!');
                } else {
                    alert('Đã xảy ra lỗi khi thêm phân công!');
                }
                console.log(error);
            });
    };

    const showAssigned = ()=>{
        api.get("/api/v1/assignment/")
        .then((res)=> res.data)  // lấy danh sách phân công
        .then((data)=>{
            setAssignedList(data);  // cập nhật state assignedList
            console.log(data);
        })
        .catch((err)=>{
            console.error('Lỗi khi lấy danh sách phân công',err);
        });
    };

    const delAssign = (assignment_id) =>{
        api.delete(`/api/v1/assignment/delete/${assignment_id}`)
        .then((res)=>{
            if (res.status ===200){
                alert('Đã xoá phân công');
                showAssigned(); // gọi lại hàm để cập nhật danh sách phân công sau khi xoá
            }
        })
        .catch((error) => {
            console.error('Lỗi khi xoá phân công', error);
            alert('Giảng viên đã có lịch học, không thể xoá phân công');
        });
    };

    // Sửa lại hàm editAssign để nhận đủ tham số
    const editAssign = (assignment_id, { lecturer_id, subject_id, class_id }) => {
        api.put(`/api/v1/assignment/edit/${assignment_id}`, { lecturer_id, subject_id, class_id })
        .then((res) => {
            if(res.status === 200){
                alert('Đã cập nhật phân công');
                showAssigned(); // gọi lại hàm để cập nhật danh sách phân công sau khi sửa
            } else {
                alert('Không thể cập nhật phân công');
            }
        })
        .catch((error) => {
            console.error('Lỗi khi cập nhật phân công', error);
            alert('Đã xảy ra lỗi khi cập nhật phân công!');
        });
    }

    return(
        <div>
            <div>
                {assignedList.map((assignment) => ( 
                <ShowAssign key={assignment.assignment_id}
                assignment={assignment}
                onDelete={delAssign}
                onEdit={editAssign}
                lecturerOptions={lecturerOptions}
                subjectOptions={subjectOptions}
                classOptions={classOptions}
                />  // hiển thị từng phân công truyền qua component ShowAssign
))}
            </div>
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
                    <button type="submit">Thêm phân công</button>
                </form>
            </div>
        </div>
    );
}

export default Assignment;

