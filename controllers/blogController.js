const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { Post } = require('../Models/Post');
const { User } = require('../Models/User');
const { validationResult } = require('express-validator');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const { deleteFileSync } = require('../util/deleteFile');




exports.create = async (req, res) => {
    let uploadedImage = '';
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array().map(error => ({ field: error.path, message: error.msg })) });
        }
        
        const file = req.file;
        let filePath = '';
        if (file) {
            filePath = file.destination + file.filename;
        }
        
        const { token } = req.cookies;
        
        const secretKey = process.env.JWT_SECRET_KEY;
        let authorId = '';
        jwt.verify(token, secretKey, (err, info) => {
            if (err) throw err;
            authorId = info.id;
        });

        const { title, summary, content } = req.body;
        uploadedImage = await uploadImage(filePath);
        deleteFileSync(filePath);
        const newPost = await Post.create({ title, summary, content, publicId: uploadedImage.public_id, cover: uploadedImage.secure_url, author: authorId });

        // Update the user's blogPosts field with the new post
        await User.findByIdAndUpdate(authorId, { $push: { blogPosts: { postId: newPost._id } } });

        return res.json({ status: 200, message: "Blog Created!!!", imgUrl: uploadedImage.secure_url });
    } catch (err) {
        deleteImage(uploadedImage.publicId);
       return  res.status(400).json({ status: 400, message: "Could not create the blog!!!" });
    }
};

exports.update = async (req, res) => {
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
        let authorId = '';
        jwt.verify(token, secretKey, (err, info) => {
            if (err) throw err;
            authorId = info.id;
        });

        const { title, summary, content, postId } = req.body;

        const postDoc = await Post.findById(postId).session(session);

        if (postDoc.author._id.toString() !== authorId) {
            throw new Error('You are not authorized to update this post');
        }

        const updatedData = {
            title,
            summary,
            content,
            cover: filePath ? filePath : postDoc.cover,
        };

        await Post.findByIdAndUpdate(postId, updatedData, { session });

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({ status: 200, message: 'Blog Updated!!!' });
    } catch (err) {
        // Rollback the transaction on any error
        await session.abortTransaction();
        session.endSession();
        return  res.status(400).json({ status: 400, message: 'Could not update the blog!!!' });
    }
};



exports.delete = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const { blogId } = req.params;
        const { token } = req.cookies;
        const secretKey = process.env.JWT_SECRET_KEY;
        let authorId = '';
        jwt.verify(token, secretKey, (err, info) => {
            if (err) throw err;
            authorId = info.id;
        });

        const postDoc = await Post.findById(blogId);
        const publicId = postDoc?.publicId;
        await Post.findByIdAndDelete(blogId);
        await User.findOneAndUpdate(
            { _id: authorId },
            { $pull: { blogPosts: { postId: blogId } } },
            { multi: true } // remove all matching items (optional)
        )

      

        await deleteImage(publicId);

        // If everything is successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({ status: 200, message: 'Blog deleted!!!' });
    } catch (err) {
        // Rollback the transaction on any error
        await session.abortTransaction();
        session.endSession();
       return  res.status(400).json({ status: 400, message: 'Could not delete the blog!!!' });
    }
};

