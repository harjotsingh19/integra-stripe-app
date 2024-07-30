import User from '../../models/userModel.js';
import response from '../../responseHandler/response.js';
import { messages, statusCode, responseStatus, otpVerificationMsgSignup, otpOperations } from '../../core/constants/constant.js';
import { jwtSign, jwtVerify } from '../../helper/jwtHelper.js';
import { ACCESS_TOKEN_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY } from '../../config/config.js';



const login = async (req, res) => {
    try {
        console.log("inside login");
        const { emailId } = req.body;
        // const condition = email ? { email: email.toLowerCase() } : { mobile: mobile }
        const user = await User.findOne({emailId});
        console.log("🚀 ~ login ~ user:", user)

        // if (user.is2faEnabled) {
        //     const sessionToken = await jwtSign(user, config.SESSION_TOKEN_SECRET_KEY, '10m');
        //     const data = {
        //         sessionToken: sessionToken
        //     }
        //     return response.HttpResponse(
        //         res,
        //         statusCode.ok,
        //         responseStatus.success,
        //         messages.loginSuccess,
        //         data,
        //     );
        // }

        console.log("🚀 ~ login ~ ACCESS_TOKEN_SECRET_KEY:", ACCESS_TOKEN_SECRET_KEY)
        console.log("🚀 ~ login ~ REFRESH_TOKEN_SECRET_KEY:", REFRESH_TOKEN_SECRET_KEY)
        const accessToken = await jwtSign(user,ACCESS_TOKEN_SECRET_KEY, '4h');
     
        const refreshToken = await jwtSign(user,REFRESH_TOKEN_SECRET_KEY, '1d');
    
        delete user._doc.password;
        // if (user.isDeactivated === true) {
        //     await User.updateOne({ _id: user._id }, {
        //         isDeactivated: false,
        //     })
        // }
        const resp = { ...user._doc };
        console.log("🚀 ~ login ~ resp:", resp)
        
        resp.accessToken = accessToken; 
        resp.refreshToken = refreshToken;
        console.log("🚀 ~ login ~ resp 2:", resp)

        return response.HttpResponse(
            res,
            statusCode.ok,
            responseStatus.success,
            messages.loginSuccess,
            resp,
        );
    } catch (error) {
        return response.HttpResponse(
            res,
            statusCode.serverError,
            responseStatus.failure,
            error.message,
        );
    }
};

// const resendOTP = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const operation = parseInt(req.body.operation, 10);
//         const { email, mobile } = req;

//         const otp = await generateOTP(userId, operation);
//         let msg = "";
//         if (operation === otpOperations.emailVerification && !req.userIsVerified) {
//             msg = otpVerificationMsgSignup(otp);
//         } else if (operation === otpOperations.mobileVerification && !req.userIsVerified) {
//             msg = otpVerificationMsgSignup(otp);
//         } else if (operation === otpOperations.passwordReset && req.userIsVerified) {
//             msg = otpVerificationMsgSignup(otp);
//         } else if (operation === otpOperations.google2fa && req.userIsVerified) {
//             msg = otpVerificationMsgSignup(otp);
//         } else {
//             return response.HttpResponse(
//                 res,
//                 statusCode.badRequest,
//                 responseStatus.failure,
//                 messages.userAlreadyVerified,
//             );
//         }
//         if (operation === otpOperations.emailVerification) {
//             await sendMail(email, messages.accountVerification, msg);
//         }

//         return response.HttpResponse(
//             res,
//             statusCode.created,
//             responseStatus.success,
//             messages.otpSendSuccess,
//             {},
//         );
//     } catch (error) {
//         return response.HttpResponse(
//             res,
//             statusCode.serverError,
//             responseStatus.failure,
//             error.message,
//         );
//     }
// };

// const forgotPassword = async (req, res) => {
//     try {
//         const condition = req.body.email ? { email: req.body.email.toLowerCase() } : { mobile: req.body.mobile }
//         const user = await User.findOne(condition);
//         const otp = await generateOTP(user._id, otpOperations.passwordReset);

//         const msg = otpVerificationMsgSignup(otp);
//         if (condition.email) {
//             await sendMail(user.email, 'Verify OTP', msg);
//         }
//         const userData = { ...user._doc };
//         delete userData.password;
//         return response.HttpResponse(
//             res,
//             statusCode.ok,
//             responseStatus.success,
//             messages.emailSend,
//             { userId: userData._id, email: userData.email },
//         );
//     } catch (error) {
//         return response.HttpResponse(
//             res,
//             statusCode.serverError,
//             responseStatus.failure,
//             error.message,
//         );
//     }
// };

// const resetPassword = async (req, res) => {
//     try {
//         const { password, userId, otp } = req.body;

//         const userOtp = await OTP.findOne({ userId, otp });

//         if (!userOtp) {
//             return response.HttpResponse(
//                 res,
//                 statusCode.badRequest,
//                 responseStatus.failure,
//                 messages.otpExpired,
//             );
//         }

//         const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
//             password
//         }, { new: true });
//         const userData = { ...updatedUser._doc };
//         delete userData.password;
//         await OTP.deleteOne({ _id: userOtp._id });
//         if (updatedUser) {
//             return response.HttpResponse(
//                 res,
//                 statusCode.ok,
//                 responseStatus.success,
//                 messages.passwordUpdated,
//                 {}
//             );
//         }
//         return response.HttpResponse(
//             res,
//             statusCode.badRequest,
//             responseStatus.failure,
//             messages.noUserFound,
//         );
//     } catch (error) {
//         return response.HttpResponse(
//             res,
//             statusCode.serverError,
//             responseStatus.failure,
//             error.message,
//         );
//     }
// };

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const verifyRefreshToken = await jwtVerify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
        console.log("🚀 ~ refreshToken ~ verifyRefreshToken:", verifyRefreshToken)
        const checkUserExists = await User.findOne({
            _id: verifyRefreshToken.id,

        });

        if (!checkUserExists) {
            return response.HttpResponse(
                res,
                statusCode.unAuthorized,
                responseStatus.failure,
                messages.unauthorizedUser,
                {},
            );
        }

        const newAccessToken = await jwtSign(checkUserExists, ACCESS_TOKEN_SECRET_KEY, '4h');

        const resp = {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
        };

        return response.HttpResponse(
            res,
            statusCode.created,
            responseStatus.success,
            messages.loginSuccess,
            resp,
        );
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.HttpResponse(
                res,
                statusCode.unAuthorized,
                responseStatus.failure,
                messages.sessionExpired,
            );
        }
        return response.HttpResponse(
            res,
            statusCode.serverError,
            responseStatus.failure,
            error.message,
        );
    }
};

const verify2fa = async (req, res) => {
    try {
        const { _2faToken, sessionToken } = req.body;
        const verifySessionToken = await jwtVerify(sessionToken, config.SESSION_TOKEN_SECRET_KEY);
        const user = await User.findOne({ _id: verifySessionToken.id });
        const validate2faToken = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: _2faToken
        })
        if (validate2faToken) {
            delete user._doc.password;
            delete user._doc.secret;
            const resp = { ...user._doc };
            const accessToken = await jwtSign(user, config.ACCESS_TOKEN_SECRET_KEY, '4h');
            const refreshToken = await jwtSign(user, config.REFRESH_TOKEN_SECRET_KEY, '1d');

            if (user.isDeactivated) {
                user.isDeactivated = false;
                await user.save();
            }

            resp.accessToken = accessToken;
            resp.refreshToken = refreshToken;

            return response.HttpResponse(
                res,
                statusCode.ok,
                responseStatus.success,
                messages.loginSuccess,
                resp,
            );
        }

        return response.HttpResponse(
            res,
            statusCode.unAuthorized,
            responseStatus.failure,
            messages.invalid2fa,
        );
    } catch (error) {
        return response.HttpResponse(
            res,
            statusCode.serverError,
            responseStatus.failure,
            error.message,
        );
    }
}
export {
    // register,
    // verifyOTP,
    login,
    // resendOTP,
    // forgotPassword,
    // resetPassword,
    refreshToken,
    // verify2fa
}