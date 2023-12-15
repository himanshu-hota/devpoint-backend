const { Post } = require("../Models/Post");
const { User } = require("../Models/User");
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

exports.userprofile = async (req, res) => {

    try {
        // const posts = await Post.find().populate('author').select('-password');
        const posts = await Post.find().populate('author', ['name']).sort({ createAt: -1 }).limit(20);
        res.json({ status: 200, message: "file received", posts: posts });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Something went wrong!!!" });
    }

}

exports.updateProfile = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array().map((error) => ({ field: error.path, message: error.msg })),
            });
        }

        const file = req.file;
        let filePath = '';
        if (file) {
            filePath = file.destination + file.filename;
        }

        const { token } = req.cookies;
        const secretKey = process.env.JWT_SECRET_KEY;
        let userId = '';
        jwt.verify(token, secretKey, (err, info) => {
            if (err) throw err;
            userId = info.id;
        });

        const { name,password,currentpassword,confirmpassword } = req.body;

        const userDoc = await User.findById(userId).session(session);

        
        
        const passwordMatch = bcrypt.compareSync(currentpassword, userDoc.password);
        const passwordMatch2 = password.length > 8 ? (password == confirmpassword) : false;
        if(!passwordMatch){
            return res.status(400).json({status:400,message:'Invalid password!!!!'});
        }

        const tempProfilePicture = 'https://images.pexels.com/photos/8728223/pexels-photo-8728223.jpeg?auto=compress&cs=tinysrgb&w=600';

        const updatedData = {
            name: name ? name : userDoc.name,
            profilePicture: filePath ? filePath : userDoc.profilePicture || tempProfilePicture,
        };

        if (password && password.length >= 8) {
            console.log('updated pass ');
            updatedData.password = bcrypt.hashSync(password, 10);
        }

        await User.findByIdAndUpdate(userId, updatedData, { session });


        // Delete the old file stored locally
        if (filePath.length > 0 && userDoc?.profilePicture) {
            const oldFilePath = path.join(__dirname, '..', userDoc?.profilePicture?.toString());
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    // Rollback the transaction on file deletion failure
                    session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ status: 400, message: 'Could not update image' });
                }
            });
        }

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({ status: 200, message: 'Blog Updated!!!' });
    } catch (err) {
        console.error(err);
        // Rollback the transaction on any error
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ status: 400, message: 'Something went wrong!!!' });
    }
};





exports.bloggerProfile = async (req, res) => {

    try {
        
        const { bloggerId } = req.params;

        const blogger = await User.findById(bloggerId).select(['-password']).populate('blogPosts.postId',['title','cover']);
        res.json({ status: 200, message: "Blogger Found!!!", user:blogger });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Something went wrong!!!" });
    }

}

exports.bloggers = async (req, res) => {

    try {
        // const posts = await Post.find().populate('author').select('-password');
        const users = await User.find().select(['-password']);
        res.json({ status: 200, message: "Bloggers found!!!", bloggers: users });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Something went wrong!!!" });
    }

}
