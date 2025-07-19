
# 🎓 Student Management System

A web-based system to manage students, courses, attendance, academic performance, and graduation status.

> ✅ Built with Node.js, Express, Knex.js, React, MySQL, Docker  
> ✅ Authentication using JWT  
> ✅ Deployment ready with Docker Compose

---

## 🚀 Technologies

- **Frontend**: React
- **Backend**: Node.js (Express), Knex.js
- **Database**: MySQL
- **Authentication**: JWT
- **Deployment**: Docker + Docker Compose

---

## ⚙️ Setup & Run

### 1. Clone & install

```bash
git clone https://github.com/your-username/student-management-system.git
cd backend && npm install
cd ../frontend && npm install
```

### 2. Create `.env` in `backend/`

```env
PORT = 3000

DB_HOST = localhost
DB_PORT = 3306
DB_USER = root
DB_PASS = 
DB_NAME = qlyhocvien

ADMIN_USERNAME = 
ADMIN_HASH_PASSWORD = use crypto.randomBytes(64).toString('hex') same for JWT_SECRET and JWT_REFRESH_SECRET
JWT_SECRET= 
JWT_REFRESH_SECRET=
```

### 3. Start project

```bash
# Terminal 1
cd backend
npm run start

# Terminal 2
cd frontend
npm run dev
```

> Or run via Docker Compose in local:
```bash
docker-compose up --build
```
## Tag backend
docker tag student-management-system-backend nhan295/student-management-system-backend:latest

## Tag frontend
docker tag student-management-system-frontend nhan295/student-management-system-frontend:latest

## Tag database (custom MySQL với data)
docker tag student-management-system-db nhan295/student-management-system-mysql:latest

## Push to Docker Hub
- docker push nhan295/student-management-system-backend:latest
- docker push nhan295/student-management-system-frontend:latest
- docker push nhan295/student-management-system-mysql:latest
## And
```bash docker-compose down -v ``` is used to stop all containers and remove the associated volumes.

```
> To pull and run the app from dockerhub, please check the instructions here:
https://github.com/nhan295/student-management-system-deploy
---

## 🧩 Main Features

| 🧩 Module                        | 📝 Description                                                                 |
|----------------------------------|--------------------------------------------------------------------------------|
| 📘 Tuyển sinh                   | Nhập thông tin sinh viên mới                                                   |
| 👤 Hồ sơ học viên              | Xem, chỉnh sửa thông tin học viên; xem kết quả học tập                        |
| 📋 Chương trình đào tạo        | Quản lý danh sách môn học trong chương trình                                  |
| 🗓️ Lịch giảng dạy & phân công | Sắp lịch dạy & phân công giảng viên                                           |
| ✏️ Hình thức & nội dung thi    | Quản lý nội dung đề thi và hình thức thi                                      |
| 📚 Kết quả học tập             | Xem kết quả các lớp, xuất file Excel nếu cần                                   |
| 🎓 Kết quả tốt nghiệp          | Tra cứu và quản lý bằng tốt nghiệp                                             |
| ⚠️ Cảnh báo học vụ             | Theo dõi học viên bị cảnh báo do kết quả hoặc điểm danh                       |
| 📝 Điểm danh                   | Quản lý việc tham gia lớp, liên kết với cảnh báo nếu học viên vắng quá mức     |

---

## 🔐 Authentication

- JWT-based access control
- Protected routes with middleware
- Refresh token via HTTP-only cookie

---

## 📦 Deployment

- Dockerized backend and frontend
- Deployment via Docker Compose
- Images can be pushed to Docker Hub


