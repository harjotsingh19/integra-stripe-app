import { validationResult, check } from "express-validator";
import response from "../../responseHandler/response.js";
import { messages, statusCode, responseStatus } from "../../core/constants/constant.js";

// Function to decode Base64
function decodeBase64(data) {
    return Buffer.from(data, 'base64').toString('utf-8');
}

// Function to validate JSON payload
function validatePayload(payload) {
    const errors = [];
    if (!payload.emailId || payload.email.trim() === '') {
        errors.push({ msg: 'Email is required.' });
    }
    if (!payload.name || payload.name.trim() === '') {
        errors.push({ msg: 'Name is required.' });
    }
    // Add more validations if needed
    return errors;
}

class Validator {
    // Validate user input
    validateuser() {
        return [
            check('name').trim().notEmpty().bail().withMessage('Name is required.'),
            check('emailId').trim().notEmpty().bail().withMessage('Email is required.'),
            // Other validations if necessary
        ];
    }

    // Middleware to decode and validate payload
    validate() {
        return (req, res, next) => {
            try {
                const encodedData = req.query.data; // Get encoded payload from query
                if (!encodedData) {
                    return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, 'Encoded payload is missing', []);
                }

                const decodedData = decodeBase64(encodedData); // Decode Base64 payload
                const payload = JSON.parse(decodedData); // Parse JSON payload

                // Validate the decoded payload
                const errors = validatePayload(payload);
                if (errors.length > 0) {
                    return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, 'Validation errors', errors);
                }

                req.body = payload; // Attach validated payload to request
                next();
            } catch (error) {
                return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, 'Invalid payload format', []);
            }
        };
    }

    // Middleware to handle validation results
    result(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const simplifiedErrors = errors.array().map(error => ({
                field: error.param,
                message: error.msg
            }));
            console.log("Validation errors:", simplifiedErrors);
            return response.HttpResponse(res, statusCode.badRequest, responseStatus.failure, 'Validation errors', simplifiedErrors);
        } else {
            next();
        }
    }
}

export default Validator;
