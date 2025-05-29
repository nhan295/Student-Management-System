// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import route của Subject
const subjectRoutes = require("./routes/subjectRoute");

// Middleware
app.use(cors());
app.use(express.json());

// Mount Subject routes ở /api/v1/subjects
app.use("/api/v1/subjects", subjectRoutes);

// Nếu cần thêm route khác, ví dụ:
// const userRoutes = require("./routes/userRoute");
// app.use("/api/v1/user", userRoutes);

module.exports = app;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000'],
    credentials: true //cho phep gui cookie qua cac request
}));

userRoute.setup(app)


module.exports = app