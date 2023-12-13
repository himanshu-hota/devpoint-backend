const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        min:5,
        unique:true
    },
    password: {
        type: String,
        required: true,
        min:8
    }
});

exports.User = mongoose.model('User', UserSchema);


