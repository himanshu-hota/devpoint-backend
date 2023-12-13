const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:userId', userController.userprofile);



module.exports = router;