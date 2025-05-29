// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import route của Subject
const subjectRoutes = require("./routes/subjectRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Subject routes ở /api/v1/subjects
app.use("/api/v1/subjects", subjectRoutes);

// Nếu cần thêm route khác, ví dụ:
// const userRoutes = require("./routes/userRoute");
// app.use("/api/v1/user", userRoutes);

module.exports = app;
