const express = require('express');
const {postValdator} = require('../util/Validators');
const blogController = require('../controllers/blogController');
const {verifyToken} = require('../util/verfiyToken');

const router = express.Router();

router.post('/create', postValdator,verifyToken,blogController.create);

router.put('/update', postValdator, verifyToken,blogController.update);

router.put('/delete/:blogId', postValdator, verifyToken,blogController.delete);

module.exports = router;