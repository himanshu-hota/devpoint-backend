// import { v2 as cloudinary } from 'cloudinary';
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

exports.uploadImage = async (imagePath) => {
    const folder = 'images';
    const res = await cloudinary.uploader.upload(imagePath,{folder});
    return res;
}

exports.deleteImage = async (publicId) => {
    const res = await cloudinary.uploader.destroy(`${publicId}`);
    return res; 
}