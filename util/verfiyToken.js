const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();


exports.verifyToken = (req,res,next) => {
    
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
    if(!token){
       return res.status(401).json({message:'Invalid Token'});
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    jwt.verify(token, secretKey, (err, info) => {
        if (err) throw next(err);
        req.userId = info.id;
        next();
    });

}