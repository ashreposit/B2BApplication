import { body, param, query, header } from 'express-validator';

const userValidator = {
    createUser:[
        body('email').exists().isEmail().withMessage('email must be in mail format'),
        body('password').exists().isString().trim().isEmpty().withMessage('Password must be a string'),
        body('role').exists().isString().trim().isEmpty().withMessage('Role must be string')
    ],
    loginUser:[
        body('email').exists().isEmail().withMessage('email must be in mail format'),
        body('password').exists().isString().trim().isEmpty().withMessage('Password must be a string')    
    ],
    updateUser:[
        param('userId').optional().isNumeric().withMessage('Id must be a string')
    ]
};

export default userValidator;