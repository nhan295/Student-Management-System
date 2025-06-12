require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const lookupRoutes = require("./routes/lookupRoute");
const scheduleRoutes = require("./routes/scheduleRoute");
const subjectRoutes = require("./routes/subjectRoute");
const userRoute = require("./routes/userRoute");
const classRoutes = require("./routes/classRoute");
const lectureRoute = require("./routes/lectureRoute");
const assignmentRoute = require("./routes/assignmentRoute");
const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");
const progressRoute = require("./routes/ProgressRoute");
const graduateCertRoute = require("./routes/graduateCertRoute");

const warningRoute = require("./routes/warningRoute");

const app = express();

// CORS trước mọi routes
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount các route
app.use("/api/v1/lookups", lookupRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/students", studentRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/graduation_certificates", graduateCertRoute);
app.use("/api/v1/warnings", warningRoute);

userRoute.setup(app);
lectureRoute.setup(app);
assignmentRoute.setup(app);
progressRoute.setup(app);
userRoute.setup(app);
lectureRoute.setup(app);
assignmentRoute.setup(app);
studentRoute.setup(app);
app.get("/", (req, res) => {
  res.send("Backend is running ✅",);
});

module.exports = app;
