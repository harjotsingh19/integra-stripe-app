
import User from '../models/userModel.js';
import { messages, responseStatus, statusCode } from "../core/constants/constant.js";


export const handleCustomerPayload = async (payload) => {
  let emailId = payload.emailId;
  console.log("🚀 ~ handleCustomerPayload ~ emailId:", emailId)
  let customerId = payload.customerId;
  console.log("🚀 ~ handleCustomerPayload ~ customerId:", customerId)


  if (!customerId) {
    if (!emailId) {
      console.log("inside customer not found");
      //   return response.HttpResponse(
      //     res,
      //     statusCode.badRequest,
      //     responseStatus.failure,
      //     messages.emailRequired,
      //     {},
      // );

      return ({
        statusCode: statusCode.badRequest,
        responseStatus: responseStatus.failure,
        message: messages.emailRequired,
        data: {}
      }
      );
    } else {
      console.log("inside else of find custoner");
      customerId = await findCustomer(emailId);

      if (!customerId) {
        // return ({
        //   statusCode: statusCode.errorPage,
        //   responseStatus: responseStatus.failure,
        //   message: messages.customerNotFound,
        //   data: {}
        // }
        // )

        return ({data:null})
      }
    }
    return ({ data: customerId })


  }
}


export const verifyCustomer = async (payload) => {
  try {
    let emailId = payload.emailId;
    let customerId = await findCustomer(emailId);
    console.log("🚀 ~ verifyCustomer ~ customer:", customerId)
    console.log("🚀 ~ verifyCustomer ~ customerId:", customerId)
    return customerId;

  } catch (error) {
    console.log("🚀 ~ verifyCustomer ~ error:", error)
    return error;
  }
}


export const findCustomer = async (emailId) => {
  console.log("🚀 ~ findCustomer ~ email:", emailId)

  let customer = await User.findOne({ emailId: emailId });
  console.log("🚀 ~ findCustomer ~ customer:", customer)
  if (customer) {
    const customerId = customer.stripeCustomerId
    console.log("🚀 ~ findCustomer ~ customerId:", customerId)
    return customerId
  }
}
