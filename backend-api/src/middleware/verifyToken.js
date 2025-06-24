const jwt = require ('jsonwebtoken');

const verifyToken = (req,res)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401); // kiểm tra access token từ header
    // nếu không có token hoặc không đúng định dạng Bearer thì trả về lỗi 401

    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return res.status(403).json({message:'Fobidden'})
        req.user = user;
        next();  //cho phép middleware tiếp theo được chạy
    });
}
module.exports = verifyToken;