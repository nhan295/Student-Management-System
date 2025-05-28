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