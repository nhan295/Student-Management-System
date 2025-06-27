-- =============================================
-- 1. Tạo Database và chọn schema
-- =============================================
CREATE DATABASE IF NOT EXISTS `qlyhocvien`;
USE `qlyhocvien`;

-- =============================================
-- 2. Tạo các bảng “gốc” (không phụ thuộc FK)
-- =============================================
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) DEFAULT NULL,
  `start_year` int DEFAULT NULL,
  `end_year` int DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lecturers` (
  `lecturer_id` int NOT NULL auto_increment,
  `lecturer_name` varchar(100) DEFAULT NULL,
  `lecturer_email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`lecturer_id`),
  UNIQUE KEY `lecturer_email` (`lecturer_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `room` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `subjects` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(100) DEFAULT NULL,
  `subject_code` varchar(50) DEFAULT NULL,
  `total_lessons` int default null,
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 3. Tạo bảng CLASS (phụ thuộc COURSES)
-- =============================================
CREATE TABLE `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(45) NOT NULL,
  `course_id` int NOT NULL,
  `total_student` int NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE KEY `unique_class_per_course` (`class_name`, `course_id`),
  KEY `fk_Class_courses1_idx` (`course_id`),
  CONSTRAINT `fk_Class_courses1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 4. Tạo bảng quan hệ N-N CLASS ↔ SUBJECTS
-- =============================================
CREATE TABLE `class_subjects` (
  `class_id` int NOT NULL,
  `subject_id` int NOT NULL,
  PRIMARY KEY (`class_id`,`subject_id`),
  KEY `fk_CS_subjects_idx` (`subject_id`),
  KEY `fk_CS_class_idx` (`class_id`),
  CONSTRAINT `fk_CS_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  CONSTRAINT `fk_CS_subjects` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 5. Tạo bảng quan hệ N-N SUBJECTS ↔ LECTURERS
-- =============================================
CREATE TABLE `subjects_lecturers` (
  `subject_id` int NOT NULL,
  `lecturer_id` int NOT NULL,
  PRIMARY KEY (`subject_id`,`lecturer_id`),
  KEY `fk_SL_lecturers_idx` (`lecturer_id`),
  KEY `fk_SL_subjects_idx` (`subject_id`),
  CONSTRAINT `fk_SL_lecturers` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`),
  CONSTRAINT `fk_SL_subjects` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 6. Tạo bảng ASSIGNMENT (phụ thuộc CLASS, LECTURERS, SUBJECTS)
-- =============================================
CREATE TABLE `assignment` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `lecturer_id` int NOT NULL,
  `class_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `unique_assignment` (`lecturer_id`, `class_id`, `subject_id`),
  KEY `fk_A_lecturer_idx` (`lecturer_id`),
  KEY `fk_A_class_idx` (`class_id`),
  KEY `fk_A_subject_idx` (`subject_id`),
  CONSTRAINT `fk_A_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  CONSTRAINT `fk_A_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`),
  CONSTRAINT `fk_A_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 7. Tạo bảng EXAM_SCHEDULE (phụ thuộc ASSIGNMENT)
-- =============================================
CREATE TABLE `exam_schedule` (
  `exSchedule_id` int NOT NULL AUTO_INCREMENT,
  `exam_format` varchar(20) NOT NULL,
  `exam_date` date DEFAULT NULL,
  `assignment_id` int NOT NULL unique,
  PRIMARY KEY (`exSchedule_id`),
  KEY `fk_ES_assignment_idx` (`assignment_id`),
  CONSTRAINT `fk_ES_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`assignment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 8. Tạo bảng STUDENTS (phụ thuộc CLASS, COURSES)
-- =============================================
CREATE TABLE `students` (
  `student_id` int NOT NULL,
  `student_name` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `party_join_date` date DEFAULT NULL,   -- ngay vao dang
  `professional_level` varchar(50) DEFAULT NULL,   -- trinh do chuyen mon
  `education_level` varchar(100) default null,  -- trinh do học vấn
  `title` varchar(50) DEFAULT NULL,  -- chuc vụ
  `agency_name` varchar(100),   -- do vị cong tac
  `plan_title` varchar(50) DEFAULT NULL,   -- chuc danh quy hoach
  `course_id` int DEFAULT NULL,
  `class_id` int NOT NULL,
  PRIMARY KEY (`student_id`),
  KEY `fk_S_course_idx` (`course_id`),
  KEY `fk_S_class_idx` (`class_id`),
  CONSTRAINT `fk_S_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  CONSTRAINT `fk_S_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 9. Tạo bảng SCHEDULES (phụ thuộc ASSIGNMENT, EXAM_SCHEDULE, ROOM)
-- =============================================
CREATE TABLE `schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `study_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `exSchedule_id` int DEFAULT NULL,
  `assignment_id` int DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `fk_S_room_idx` (`room_id`),
  KEY `fk_S_ES_idx` (`exSchedule_id`),
  KEY `fk_S_A_idx` (`assignment_id`),
  CONSTRAINT `fk_S_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  CONSTRAINT `fk_S_ES`   FOREIGN KEY (`exSchedule_id`) REFERENCES `exam_schedule` (`exSchedule_id`),
  CONSTRAINT `fk_S_A`    FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 10. Tạo bảng EXAMS (phụ thuộc EXAM_SCHEDULE, STUDENTS, SUBJECTS)
-- =============================================
CREATE TABLE `exams` (
  `exam_id` int NOT NULL AUTO_INCREMENT,
  `grade` float DEFAULT NULL,
  `subject_id` int NOT NULL,
  `student_id` int NOT NULL,
  PRIMARY KEY (`exam_id`),
  KEY `fk_E_subject_idx` (`subject_id`),
  KEY `fk_E_student_idx` (`student_id`),
  CONSTRAINT `fk_E_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `fk_E_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 11. Tạo bảng GRADUATION_CERTIFICATES (phụ thuộc STUDENTS)
-- =============================================
CREATE TABLE `graduation_certificates` (
  `certificate_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `certificate_number` varchar(100) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `is_issued` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`certificate_id`),
  KEY `fk_GC_student_idx` (`student_id`),
  CONSTRAINT `fk_GC_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 12. Tạo bảng STUDY_WARNINGS (phụ thuộc STUDENTS, ASSIGNMENT)
-- =============================================
CREATE TABLE `study_warnings` (
  `warning_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `absent_day` int DEFAULT NULL,
  `total_day` int DEFAULT NULL,
  `assignment_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`warning_id`),
  KEY `fk_SW_student_idx`    (`student_id`),
  KEY `fk_SW_assignment_idx` (`assignment_id`),
  CONSTRAINT `fk_SW_student`    FOREIGN KEY (`student_id`)    REFERENCES `students` (`student_id`),
  CONSTRAINT `fk_SW_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 13. Tạo bảng ATTENDANCE (phụ thuộc STUDENTS, SCHEDULES)
-- =============================================
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `schedule_id` int DEFAULT NULL,
  `is_present` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`attendance_id`),
  KEY `fk_A_student_idx`  (`student_id`),
  KEY `fk_A_schedule_idx` (`schedule_id`),
  CONSTRAINT `fk_A_student`  FOREIGN KEY (`student_id`)  REFERENCES `students` (`student_id`),
  CONSTRAINT `fk_A_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 14. Chèn dữ liệu mẫu (theo đúng thứ tự)
-- =============================================
-- 14.2 LECTURERS
INSERT INTO `lecturers` (`lecturer_name`, `lecturer_email`)
VALUES
  ('Nguyễn Văn A', 'nguyenvana@chinhtri.vn'),
  ('Trần Thị B',   'tranthib@chinhtri.vn'),
  ('Lê Văn C',     'levanc@chinhtri.vn');

-- 14.3 ROOM
INSERT INTO `room` (`room_id`, `room_name`)
VALUES
  (1, 'Hội Trường A1'),
  (2, 'P101'),
  (3, 'P102');

-- 14.4 SUBJECTS
INSERT INTO `subjects` (`subject_name`, `subject_code`, `total_lessons`)
VALUES
  ('Triet hoc Mac, Lenin trong doi song xa hoi', 'A.I.1', 4),
  ('Chu nghia duy vat macxit, the gioi quan khoa hoc cho nhan thuc va cai tao hien thuc', 'A.I.2', 4),
  ('Hai nguyen ly cua phep bien chung duy vat', 'A.I.3', 4),
  ('Cac cap pham tru cua phep bien chung duy vat', 'A.I.4', 8),
  ('Nhung quy luat co ban cua phep bien chung duy vat', 'A.I.5', 8);



