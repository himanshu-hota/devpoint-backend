const { Post } = require("../Models/Post");

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
