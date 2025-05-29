const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

module.exports.setup = (app) =>{
    app.use('/api/v1/user_auth',router)

    router.post('/login',userController.login);
    router.post('/refeshtoken',userController.refeshToken);

    router.get('/admin-only',verifyToken,(req,res,next)=>{
        res.json({message: 'Welcom!'})
    })
}