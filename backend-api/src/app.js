const express = require("express");
const cors = require("cors");
require("dotenv").config();

const subjectRoutes = require("./routes/subjectRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/subjects", subjectRoutes);

module.exports = app;
