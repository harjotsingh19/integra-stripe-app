import { SWITCHBOARD_FRONT_END_VERSION, SWITCHBOARD_BACK_END_VERSION } from "../../config/config.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";
import response from "../../responseHandler/response.js";





export const getVersion = async (req, res) => {
    try {
        const imageVersions = {
            frontend: SWITCHBOARD_FRONT_END_VERSION,
            backend: SWITCHBOARD_BACK_END_VERSION
        };
        console.log("🚀 ~ getVersion ~ imageVersions:", imageVersions)
        if (imageVersions.frontend && imageVersions.backend){
            console.log("insid eif");
            return response.HttpResponse(
                res,
                statusCode.ok,
                responseStatus.success,
                messages.VersionFetched,
                imageVersions
            )
        }
        return response.HttpResponse(
            res,
            statusCode.badRequest,
            responseStatus.failure,
            messages.VersionNotFetched,
            {}
        )
    } catch (err) {
        return response.HttpResponse(
            res,
            statusCode.serverError,
            responseStatus.failure,
            messages.err,
            {}
        )
    }
}