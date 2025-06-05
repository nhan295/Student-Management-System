require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const subjectRoutes = require("./routes/subjectRoute");
const userRoute = require("./routes/userRoute");
const classRoutes = require("./routes/classRoute");
const lectureRoute = require("./routes/lectureRoute");
const assignmentRoute = require("./routes/assignmentRoute")

const app = express();

// CORS, JSON body, Cookie parser
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount các route
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/classes", classRoutes);

userRoute.setup(app);
lectureRoute.setup(app);
assignmentRoute.setup(app);


module.exports = app;
