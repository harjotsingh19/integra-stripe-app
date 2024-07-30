import { jwtVerify } from '../helper/jwtHelper.js';
import User from '../models/userModel.js';
import response from '../responseHandler/response.js';
import { messages, responseStatus, statusCode } from '../core/constants/constant.js';
import {ACCESS_TOKEN_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY} from '../config/config.js';

const isAuthenticated = async (req, res, next) => {
    try {
        let isVerified;
        const token = req.headers.authorization;

        // check if bearer token exists or not.
        if (!token || !req.headers.authorization.startsWith('Bearer')) {
            return response.HttpResponse(
                res,
                statusCode.unAuthorized,
                responseStatus.failure,
                messages.unauthorizedUser,
            );
        }

        // verify JWT token(bearer token).
        try {
            isVerified = await jwtVerify(token.split(' ')[1], ACCESS_TOKEN_SECRET_KEY);
        } catch (error) {
            return response.HttpResponse(
                res,
                statusCode.unAuthorized,
                responseStatus.failure,
                messages.unauthorizedUser,
            );
        }
        // check if user exists.
        const user = await User.findOne({
            _id: isVerified.id,
        });
        if (!user) {
            return response.HttpResponse(
                res,
                statusCode.unAuthorized,
                responseStatus.failure,
                messages.unauthorizedUser,
            );
        }

        // if (user.isDeleted) {
        //     return response.HttpResponse(
        //         res,
        //         statusCode.unAuthorized,
        //         responseStatus.failure,
        //         messages.userNotFound,
        //     );
        // }

        // if (user.isEmailVerified === false && user.isMobileVerified === false) {
        //     return response.HttpResponse(
        //         res,
        //         statusCode.unAuthorized,
        //         responseStatus.failure,
        //         messages.userNotVerified,
        //     );
        // }

        // if (user.isLocked) {
        //     return response.HttpResponse(
        //         res,
        //         statusCode.unAuthorized,
        //         responseStatus.failure,
        //         messages.lockedProfile,
        //     );
        // }
       
        // if (user.isDeactivated) {
        //     return response.HttpResponse(
        //         res,
        //         statusCode.unAuthorized,
        //         responseStatus.failure,
        //         messages.deactivatedUser,
        //     );
        // }

        // set user id in request.
        req.userId = user._id;
        req.email = user.emailId;
        // req.mobile = user.mobile;
        next();
    } catch (error) {
        return response.HttpResponse(
            res,
            statusCode.serverError,
            responseStatus.failure,
            error.message,
        );
    }
};


export default isAuthenticated;