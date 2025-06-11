import api from '../api';
import{ useEffect,useState } from 'react';
import Select from "react-select";
function ExamAssignmentPage() {


    const [assignedList,setAssignedList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [classList, setClassList] = useState([]);

    useEffect(()=>{
        getAllAssignment();
    },[])
    const getAllAssignment = ()=>{
        api.get('/api/v1/exam-assignment/')
        .then((res)=> res.data)
        .then((data)=>{
            setAssignedList(data);
        })
    };

    const getSubject = ()=>{
        api.get('/api/v1/assignment/subjects')
        .then((res)=> res.data)
        .then ((data)=>{
            setSubjectList(data);
        })
    };
    const getClassBySubject = (subject_id)=>{
        api.get(`/api/v1/assignment/class/${subject_id}`)
        .then((res)=> res.data)
        .then((data)=>{
            setClassList(data);
        })
    }
  return (
    <div>
      <h1>Exam Assignment Page</h1>
      <p>This page will handle the exam assignment logic.</p>
    </div>
  );
}
export default ExamAssignmentPage;