const { Post } = require('../Models/Post');
const { User } = require('../Models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');



exports.create = async (req, res) => {
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
        const newPost = await Post.create({ title, summary, content, cover: filePath, author: authorId });

        // Update the user's blogPosts field with the new post
        await User.findByIdAndUpdate(authorId, { $push: { blogPosts: { postId: newPost._id } }, $inc: { totalBlogs: 1 } });

        return res.json({ status: 200, message: "Blog Created!!!" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ status: 400, message: "Something went wrong!!!" });
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

        // Delete the old file stored locally
        if (filePath.length > 0) {
            const oldFilePath = path.join(__dirname, '..', postDoc.cover);
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






















// exports.update = async (req, res) => {

//     try {

//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({ errors: errors.array().map(error => ({ field: error.path, message: error.msg })) });
//         }

//         const file = req.file;
//         let filePath = '';
//         if (file) {
//             filePath = file.destination + file.filename;
//         }

//         const { token } = req.cookies;
//         const secretKey = process.env.JWY_SECRET_KEY;
//         let authorId = '';
//         jwt.verify(token, secretKey, (err, info) => {

//             if (err) throw err;
//             authorId = info.id;
//         });
        
//         const { title, summary, content,postId } = req.body;

//         const postDoc = await Post.findById(postId);

//         if(postDoc.author._id.toString() !== authorId){
//             throw new Error('You are not authorized to update this post');
//         }
        
//         const updatedData = {
//             title,
//             summary,
//             content,
//             cover:filePath ? filePath : postDoc.cover
//         }
//         await Post.findByIdAndUpdate(postId,updatedData);

//         // Delete the old file stored locally
//         if (filePath.length > 0) {
//             const oldFilePath = path.join(__dirname,'..', postDoc.cover);
//             console.log(oldFilePath);
//             fs.unlink(oldFilePath, (err) => {
//                 if (err) {
//                   return res.status(400).json({status:400,message:'Could not update image'});
//                 } 
//             });
//         }

//         return res.json({ status: 200, message: "Blog Created!!!" });


//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ status: 400, message: "Something went wrong!!!" });
//     }

// }

// exports.create = async (req, res) => {

//     try {

//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return res.status(422).json({ errors: errors.array().map(error => ({ field: error.path, message: error.msg })) });
//         }


//         const file = req.file;
//         let filePath = '';
//         if (file) {
//             filePath = file.destination + file.filename;
//         }

//         const { token } = req.cookies;
//         const secretKey = process.env.JWY_SECRET_KEY;
//         let authorId = '';
//         jwt.verify(token, secretKey, (err, info) => {

//             if (err) throw err;
//             authorId = info.id;
//         });

        

//         const { title, summary, content } = req.body;
//         await Post.create({ title, summary, content, cover: filePath,author:authorId});

//         return res.json({ status: 200, message: "Blog Created!!!" });


//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ status: 400, message: "Something went wrong!!!" });
//     }

// }
