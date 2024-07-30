
import User from '../models/userModel.js';
import { messages, responseStatus, statusCode} from "../core/constants/constant.js";


export const handleCustomerPayload = async (payload) => {
  let emailId = payload.emailId;
  console.log("🚀 ~ handleCustomerPayload ~ emailId:", emailId)
  let customerId = payload.customerId;
  console.log("🚀 ~ customerId:", customerId)

  if (!customerId){
    if(!emailId){
    //   return response.HttpResponse(
    //     res,
    //     statusCode.badRequest,
    //     responseStatus.failure,
    //     messages.emailRequired,
    //     {},
    // );

    return ({statusCode:statusCode.badRequest,
      responseStatus:responseStatus.failure,
      message:messages.emailRequired,
      data:{}
    }
  );
    }else{
      customerId = await findCustomer(emailId);
      if(!customerId){
        return ({statusCode:statusCode.errorPage,
          responseStatus:responseStatus.failure,
          message:messages.customerNotFound,
          data:{}}
        )}}
      return({data:customerId})

    
}}

export const findCustomer = async (emailId) => {
    console.log("🚀 ~ findCustomer ~ email:", emailId)
   
    let customer = await User.findOne({ emailId: emailId });
      console.log("🚀 ~ findCustomer ~ customer:", customer)
      if (customer){
        const customerId = customer.stripeCustomerId
        console.log("🚀 ~ findCustomer ~ customerId:", customerId)
        return customerId
      }
}
