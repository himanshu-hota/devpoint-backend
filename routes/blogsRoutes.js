const express = require('express');
const postController = require('../controllers/blogsController');

const router = express.Router();

router.get('/',postController.getBlogs);

router.get('/:blogId', postController.getSingleBlog);

module.exports = router;