const { validationResult } = require('express-validator');
const {User} = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {

    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array().map(error => ({ field: error.path, message: error.msg })) });
        }

        const { name, email, password } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ status:400,message:"User already exists!!!" });
        }
        
        // bcrypt essential
        const saltRounds = 10;
        
        // create new user
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({status:201,message:'Registration successfull'});
    } catch (err) {
        return res.status(400).json({status:404,message:'Something went wrong!!!'});
    }
}


exports.login = async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array().map(error => ({ field: error.param, message: error.msg })) });
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ status: 400, message: "User Not found!!!" });
        }
        
        const passwordMatch = bcrypt.compareSync(password, existingUser.password);

        if (!passwordMatch) {
            return res.status(400).json({ status: 400, message: "Invalid Password!!!" });
        }


        const secretKey = process.env.JWT_SECRET_KEY;
        const expiresIn = 7 * 24 * 60 * 60;
        jwt.sign({ email, id: existingUser._id }, secretKey, { expiresIn }, (err, token) => {
            if (err) throw err;
            return res.cookie('token', token).json({ status: 200, message: "Login successfull",data:{name:existingUser.name,email:existingUser.email,id:existingUser._id.toString()},token });
        })




    } catch (err) {
        return res.status(400).json({ status: 404, message: 'Something went wrong!!!' });
    }
}


exports.profile = async (req,res) => {
    
    try {
        
        const {token} = req.body;
        
        if(!token){
            return res.status(404).json({status:404,message:'Invalid Token'});
        }
        
        let userId = '';
        const secretKey = process.env.JWT_SECRET_KEY;
        jwt.verify(token,secretKey, (err,info) => {

            if(err) throw err;
            userId = info.id;
        });

        const user = await User.findById(userId).select('-password').populate('blogPosts.postId');
        return res.json({ status: 200, message: 'Token verified', data: user });

    } catch (err) {
        return  res.status(400).json({status:499,message:"Something went wrong!!!"});
    }

}


exports.logout = (req, res) => {

    try {
        return res.cookie('token','').json({ status: 200, message: 'Logout successful' });
    } catch (err) {
        return res.status(400).json({ status: 499, message: "Something went wrong!!!" });
    }

}