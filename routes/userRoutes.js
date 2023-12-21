const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../util/verfiyToken');

const router = express.Router();

router.post('/update', verifyToken, userController.updateProfile);

router.get('/bloggers', verifyToken, userController.bloggers);

router.get('/bloggers/:bloggerId', verifyToken, userController.bloggerProfile);

router.get('/:userId', verifyToken, userController.userprofile);

router.post('/update', verifyToken, userController.updateProfile);





module.exports = router;