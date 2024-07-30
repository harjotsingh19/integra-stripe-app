import { validationResult, check } from "express-validator";
import User from "../../models/userModel.js";
import * as passwordManager from '../../helper/passwordManager.js';
import response from "../../responseHandler/response.js";
import { messages, statusCode, responseStatus } from "../../core/constants/constant.js";


class Validator {
    // validateUserSignup() {
    //     return [
    //         check('email')
    //             .optional()
    //             .trim()
    //             .notEmpty()
    //             .bail()
    //             .withMessage('Email is required.')
    //             .isEmail()
    //             .bail()
    //             .withMessage("enter a valid email address")
    //             .custom(async (value) => {
    //                 const user = await User.findOne({
    //                     email: value.toLowerCase(),
    //                     isEmailVerified: true,
    //                 });
    //                 if (user) {
    //                     throw new Error(messages.emailAlreadyExists);
    //                 }
    //             }),
    //         check('mobile')
    //             .optional()
    //             .trim()
    //             .notEmpty()
    //             .bail()
    //             .withMessage('Mobile is required.')
    //             .isLength({ min: 10, max: 13 })
    //             .bail()
    //             .withMessage("mobile number should be of 10 digits")
    //             .isNumeric()
    //             .bail()
    //             .withMessage('Mobile can contain digits only')
    //             .custom(async (value) => {
    //                 const user = await User.findOne({
    //                     mobile: value,
    //                     isMobileVerified: true,
    //                 });
    //                 if (user) {
    //                     throw new Error(messages.mobileAlreadyExists);
    //                 }
    //             }),
    //         check('password').trim().not().isEmpty().bail().withMessage("password is empty").isLength({ min: 10 }).bail().withMessage("Pasword is too small").matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).bail().withMessage("Enter a strong password"),
    //     ]
    // }

    // validateOtp() {
    //     return [
    //         check('userId').trim().notEmpty().bail().withMessage('User Id is required.')
    //             .custom(async (value) => {
    //                 const user = await User.findOne({ _id: value });
    //                 if (!user) {
    //                     throw new Error(messages.noUserFound);
    //                 }
    //             }),
    //         check('otp').trim().notEmpty().bail().withMessage('OTP is required.'),
    //         check('operation').trim().notEmpty().withMessage('Operation is required.'),
    //     ]
    // }

    // validateResendOtp() {
    //     return [
    //         check('userId')
    //             .trim()
    //             .notEmpty()
    //             .bail()
    //             .withMessage('User Id is required.')
    //             .custom(async (value, { req }) => {
    //                 const user = await User.findOne({ _id: value });
    //                 if (!user) {
    //                     throw new Error(messages.noUserFound);
    //                 }
    //                 req.email = user?.email ?? null;
    //                 req.mobile = user?.mobile ?? null;
    //                 req.userIsVerified = user?.email ? user.isEmailVerified : user.isMobileVerified;
    //             }),
    //         check('operation')
    //             .trim()
    //             .notEmpty()
    //             .withMessage('Operation is required.'),
    //     ]
    // }

    validateUserLogin() {
        // console.log("inside validate login");
        return [
            check('password').trim().notEmpty().withMessage('Password is required.'),
            check('emailId')
                .optional()
                .trim()
                .notEmpty()
                .bail()
                .withMessage('Email is required.')
                .isEmail()
                .bail()
                .withMessage('Please enter valid email.')
                .custom(async (value, { req }) => {
                    const user = await User.findOne({
                        emailId: value.toLowerCase(),
                    });
                    console.log("🚀 ~ Validator ~ .custom ~ user:", user)
                    
                    // if (!user || user?.isDeleted === true) {
                    //     throw new Error(messages.userNotRegistered);
                    // }
                    // if (!user?.isEmailVerified) {
                    //     throw new Error(messages.userNotVerified);
                    // }

                    const checkPw = await passwordManager.comparePassword({
                       
                        plainPassword: req.body.password,
                        hashPassword: user.password,
                    });
                    console.log("inside check passworf 00000000000000",checkPw)
                    if (!checkPw) {
                        throw new Error(messages.incorrectEmailOrPassword);
                    }
                })

        ]
    }

    
    validateRefreshToken() {
        // console.log("checkkkkkkkk");
        return [
            check('refreshToken').trim().notEmpty().withMessage('Refresh token is required.')
        ]
    }

    result(req, res, next) {
        // console.log("inside validate result");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(err => console.log("err", err))
            return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, messages.validationError, errors.array());
        } else {
            next()
        }
    }
}
export default Validator;