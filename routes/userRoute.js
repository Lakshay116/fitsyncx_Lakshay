const express = require('express')

const router = express.Router();

const { signupValidation, loginValidation } = require('../helper/validation')

const usercontroller = require('../controller/usercontroller')

router.post('/register', signupValidation, usercontroller.register);
router.post('/login', loginValidation, usercontroller.login);


module.exports = router;