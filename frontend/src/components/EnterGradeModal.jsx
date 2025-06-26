import React, { useEffect, useState } from "react";
import api from "../api";
import { Modal, Form, Select, InputNumber, Table, message } from "antd";

const { Option } = Select;

const EnterGradeModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, classesRes] = await Promise.all([
          api.get("/api/v1/subjects"),
          api.get("/api/v1/classes/all-classes"),
        ]);
        setSubjects(subjectsRes.data);
        setClasses(classesRes.data);
      } catch {
        message.error("Lỗi tải học phần hoặc lớp học");
      }
    };
    fetchData();
  }, []);

  const fetchStudents = async (classId) => {
    try {
      const res = await api.get(
        `/api/v1/classes/${classId}/students`
      );
      setStudents(res.data);
    } catch {
      message.error("Lỗi khi tải danh sách sinh viên");
    }
  };

  const handleGradeChange = (studentId, value) => {
    setGrades((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject || !selectedClass) {
      message.warning("Vui lòng chọn học phần và lớp học");
      return;
    }

    const subject = subjects.find((s) => s.subject_id === selectedSubject);
    const subjectName = subject?.subject_name;

    if (!subjectName) {
      message.error("Không tìm thấy tên học phần.");
      return;
    }

    try {
      for (const student of students) {
        const grade = grades[student.student_id] ?? null;

        if (grade !== null) {
          await api.put("/api/v1/classes/update-grade", {
            studentId: student.student_id,
            subjectName: subjectName,
            newGrade: grade,
          });
        }
      }

      message.success("Nhập điểm thành công");
      onClose();
      form.resetFields();
      setGrades({});
      setStudents([]);
    } catch (error) {
      console.error("Lỗi khi lưu điểm:", error);
      message.error("Lỗi khi lưu điểm");
    }
  };

  return (
    <Modal
      title="📝 Nhập điểm mới"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu điểm"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Học phần" name="subject">
          <Select
            placeholder="Chọn học phần"
            onChange={(value) => setSelectedSubject(value)}
          >
            {subjects.map((s) => (
              <Option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Lớp học" name="class">
          <Select
            placeholder="Chọn lớp học"
            onChange={(value) => {
              setSelectedClass(value);
              fetchStudents(value);
            }}
          >
            {classes.map((c) => (
              <Option key={c.class_id} value={c.class_id}>
                {c.class_name} ({c.course_name})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {students.length > 0 && (
        <Table
          dataSource={students}
          rowKey="student_id"
          pagination={false}
          bordered
          columns={[
            {
              title: "Mã SV",
              dataIndex: "student_id",
            },
            {
              title: "Tên sinh viên",
              dataIndex: "student_name",
            },
            {
              title: "Điểm",
              render: (_, record) => (
                <InputNumber
                  min={0}
                  max={10}
                  step={0.1}
                  style={{ width: "100%" }}
                  value={grades[record.student_id]}
                  onChange={(value) =>
                    handleGradeChange(record.student_id, value)
                  }
                />
              ),
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default EnterGradeModal;
