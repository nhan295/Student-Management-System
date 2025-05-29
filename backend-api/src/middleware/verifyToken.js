const jwt = require ('jsonwebtoken');

const verifyToken = (req,res)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({message:'Fobidden'})
        req.user = user;
        next();  //cho phép middleware tiếp theo được chạy
    });
}
module.exports = verifyToken;