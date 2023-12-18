const mongoose = require('mongoose');

const { Schema,model} = mongoose;

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    publicId:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
}, {
    timestamps: true
});

exports.Post = new model('Post',PostSchema);