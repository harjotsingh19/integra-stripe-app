import express from 'express';
const router = express.Router();
import * as authController from './controller.js';
import Validator from "./validator.js";
const authValidator = new Validator();


// router.post('/register', authValidator.validateUserSignup(), authValidator.result, authController.register);
// router.patch('/verify', authValidator.validateOtp(), authValidator.result, authController.verifyOTP);
router.post('/login', authValidator.validateUserLogin(), authValidator.result, authController.login);
// router.post('/verify-2fa',authValidator.validateVerify2Fa(), authValidator.result, authController.verify2fa);
// router.post('/send-otp', authValidator.validateResendOtp(), authValidator.result, authController.resendOTP);
// router.post('/forgot-password', authValidator.validateForgotPassword(), authValidator.result, authController.forgotPassword);
// router.patch('/reset-password', authValidator.validateResetPassword(), authValidator.result, authController.resetPassword);
router.post('/refresh-token', authValidator.validateRefreshToken(), authValidator.result, authController.refreshToken);


export default router;