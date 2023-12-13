const express = require('express');
const {postValdator} = require('../util/Validators');

const blogController = require('../controllers/blogController');

const router = express.Router();

router.post('/create', postValdator,blogController.create);

router.put('/update', postValdator, blogController.update);

module.exports = router;