import { validationResult, check } from "express-validator";
import response from "../../responseHandler/response.js";
import { messages, statusCode, responseStatus } from "../../core/constants/constant.js";



class Validator {

    validateUserEmail() {

        return [
            check('email')
                .optional()
                .trim()
                .notEmpty()
                .bail()
                .withMessage('Email is required.')
                .isEmail()
                .bail()
                .withMessage('Please enter valid email.'

                    // if (!user || user?.isDeleted === true) {
                    //     throw new Error(messages.userNotRegistered);
                    // }
                    // if (!user?.isEmailVerified) {
                    //     throw new Error(messages.userNotVerified);
                    // }



                )

        ]
    }

    result(req, res, next) {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(err => console.log("err", err))
            return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, messages.validationError, errors.array());
        } else {
            next()
        }
    }
}

export default Validator