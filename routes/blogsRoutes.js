const express = require('express');
const postController = require('../controllers/blogsController');
const { verifyToken } = require('../util/verfiyToken');

const router = express.Router();

router.get('/',postController.getBlogs);

router.get('/:blogId', verifyToken, postController.getSingleBlog);

module.exports = router;