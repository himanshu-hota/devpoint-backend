const { body } = require('express-validator');

exports.registerValdator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 8 characters'),
    body('confirmpassword').custom((value, { req }) => {

        if(value.length < 8){
            throw new Error('Password must be at least 8 characters');
        }

        if (value !== req.body.password) {
            throw new Error('Confirm password does not match');
        }
        return true;
    }),

];

exports.loginValdator = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

exports.postValdator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('summary').notEmpty().withMessage('Summary is required'),
    body('content').notEmpty().withMessage('Content is required'),
    
];