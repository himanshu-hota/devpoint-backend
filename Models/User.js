const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 255,
        unique:true
    },
    password: {
        type: String,
        required: true,
        min:8
    },
    profilePicture: {
        type: String,
    },
    totalBlogs: {
        type: Number,
        default: 0  // default to 0 when a new user is created
    },
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


