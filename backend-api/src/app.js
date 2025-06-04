require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const subjectRoutes = require("./routes/subjectRoute");
const userRoute = require("./routes/userRoute");
const classRoutes = require("./routes/classRoute");
const studentRoute = require("./routes/studentRoute");

const app = express();

// CORS trước mọi routes
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/student', studentRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
