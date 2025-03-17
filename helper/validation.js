const { check } = require('express-validator');

exports.signupValidation = [
    check('name', 'Name Required').not().isEmpty(),
    check('email', 'Email Required').isEmail(),
    check('phone', '10 digit Phone Required').isLength({ min: 10, max: 10 }).isMobilePhone(),
    check('password', 'Password Required').isLength({ min: 8 })
]


exports.loginValidation = [
    check('email', 'Valid Email Required').isEmail(),
    check('password', 'Password Required min length 8').isLength({ min: 8 })
]

