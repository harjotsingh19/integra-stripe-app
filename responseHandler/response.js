class HttpResponse {
    HttpResponse(res,statusCode,resoonseStatus,message,data){
        res.status(statusCode).json({
            statusCode:statusCode,
            status:resoonseStatus,
            message:message,
            data:data
        })
    }
}
export default new HttpResponse();