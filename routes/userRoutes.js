const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/update', userController.updateProfile);

router.get('/bloggers', userController.bloggers);

router.get('/bloggers/:bloggerId', userController.bloggerProfile);

router.get('/:userId', userController.userprofile);

router.post('/update', userController.updateProfile);





module.exports = router;