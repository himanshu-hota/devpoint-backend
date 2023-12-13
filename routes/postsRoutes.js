const express = require('express');
const postController = require('../controllers/postsController');

const router = express.Router();

router.get('/',postController.posts);

router.get('/:postId', postController.singlepost);

module.exports = router;