const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Post } = require("../Models/Post");
const { User } = require("../Models/User");
const { validationResult } = require('express-validator');
const { deleteImage, uploadImage } = require("../config/cloudinary");
const { deleteFileSync } = require('../util/deleteFile');

exports.userprofile = async (req, res) => {

    try {
        const posts = await Post.find().populate('author', ['name']).sort({ createAt: -1 }).limit(20);
        return res.json({ status: 200, message: "file received", posts: posts });
    } catch (err) {
        return res.status(400).json({ status: 400, message: "Could not get the user profile!!!" });
    }

}

exports.updateProfile = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let newProfilePictureURL = '';
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

        const userId = req.userId;

        if (filePath) {
            newProfilePictureURL = await uploadImage(filePath);
        }

        const { name, password, currentpassword, confirmpassword } = req.body;

        const userDoc = await User.findById(userId).session(session);
        const oldProfilePicturePath = userDoc.publicId;

        if (oldProfilePicturePath) {
            await deleteImage(oldProfilePicturePath);
        }
        if(filePath) deleteFileSync(filePath);

        const passwordMatch = bcrypt.compareSync(currentpassword, userDoc.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: 400, message: 'Invalid password!!!!' });
        }

        
        const updatedData = {
            name: name ? name : userDoc.name,
            profilePicture: filePath ? newProfilePictureURL.secure_url : userDoc.profilePicture,
            publicId: newProfilePictureURL.public_id
        };

        if (password && password.length >= 8) {
            updatedData.password = bcrypt.hashSync(password, 10);
        }

        await User.findByIdAndUpdate(userId, updatedData, { session });

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({ status: 200, message: 'Blog Updated!!!' });
    } catch (err) {
        deleteImage(newProfilePictureURL.public_id);
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        return res.status(400).json({ status: 400, message: 'Could not update the profile!!!' });
    }
};





exports.bloggerProfile = async (req, res) => {

    try {

        const { bloggerId } = req.params;
        const blogger = await User.findById(bloggerId).select(['-password']).populate('blogPosts.postId', ['title', 'cover']);
        return res.json({ status: 200, message: "Blogger Found!!!", blogger: blogger });
    } catch (err) {
        return res.status(400).json({ status: 400, message: "Could not fetch the blogger info!!!" });
    }

}

exports.bloggers = async (req, res) => {

    try {
        // const posts = await Post.find().populate('author').select('-password');
        const users = await User.find().select(['-password']);
        return res.json({ status: 200, message: "Bloggers found!!!", bloggers: users });
    } catch (err) {
        return res.status(400).json({ status: 400, message: "Could not fetch the bloggers!!!" });
    }

}
