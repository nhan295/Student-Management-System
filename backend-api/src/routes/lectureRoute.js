const lectureController = require('../controllers/lectureController');
const express = require('express');
const router = express.Router();

module.exports.setup = (app) =>{
    app.use('/api/v1/lecturer',router)

    router.get('/',lectureController.getAllLecture)
}