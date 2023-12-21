const { Post } = require("../Models/Post");

exports.getBlogs = async (req, res) => {

    try {
        const posts = await Post.find().populate('author', ['name']).sort({ createdAt: -1 });
        return res.json({ blogs:posts});
    } catch (err) {
        return res.status(400).json({ status: 400, message: "Could not fetch blogs!!!" });
    }

}

exports.getSingleBlog = async (req, res) => {
    
    try {

        const { blogId } = req.params;

        const post = await Post.findById(blogId).populate('author', ['name']);

        if (!post) throw new Error('Post Not Found!!!');

        return res.json({ status: 200, message: "Post fetched", post: post });
    } catch (err) {
        return res.status(400).json({ status: 400, message: "Could not get the blog!!!" });
    }

}