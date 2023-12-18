const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    profilePicture: {
        type: String,
    },
    publicId: String,
    blogPosts: [
        {
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post' // reference to another model representing your blog post
            }
        }
    ]
}, {
    timestamps: true
});

exports.User = mongoose.model('User', UserSchema);


