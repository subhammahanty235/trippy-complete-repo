const express = require('express');
const { SignUpWithOTP, LoginWithOtp, validateOTPForLogin, validateOTPAndCreateUser } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/getSignupOtp', SignUpWithOTP);
router.post('/validate/otp/signup' , validateOTPAndCreateUser)
router.post('/getLoginOtp' , LoginWithOtp);
router.post('/validate/otp/login', validateOTPForLogin)

module.exports = router;