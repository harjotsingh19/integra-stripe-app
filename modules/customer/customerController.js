import Stripe from 'stripe';
import { stripeSecretKey } from '../../config/config.js';  // Use named import
import User from '../../models/userModel.js';
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode} from "../../core/constants/constant.js";
import { findCustomer, handleCustomerPayload } from "../../utils/common.js";


const stripe = new Stripe(stripeSecretKey);  // Initialize Stripe with the named export

export const registerUser = async (req, res) => {
  try {

    const data = req.query.data;
    const jsonString = atob(data);
    const userData = JSON.parse(jsonString);
    console.log("🚀 ~ registerUser ~ userData:", userData)
    const {emailId, name} = userData;
    if(!emailId){
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.emailRequired,
        {}
    )
    }    
    let customerId = await findCustomer(emailId)
    console.log("🚀 ~ registerUser ~ customer:", customerId)
    if(customerId){
      console.log("aaaaaaaaa");
      const paymentMethods = await stripe.customers.listPaymentMethods(customerId, { type: 'card' });
      console.log("🚀 ~ listPaymentMethods ~ paymentMethods:", paymentMethods);
      return response.HttpResponse(
        res,
        statusCode.created,
        responseStatus.success,
        messages.customerFound,
        {customerId:customerId,paymentsMethods:paymentMethods},
    );
    }

    console.log("eee");
    // Create a new Stripe customer
    const email = emailId;
    console.log("🚀 ~ registerUser ~ email:", email)
    const customer = await stripe.customers.create({  email,name });

    const newUser = await User.create({
      name : name,
      emailId: emailId,
      stripeCustomerId: customer.id,
  });
    console.log("🚀 ~ registerUser ~ newUser:", newUser)
  
    return response.HttpResponse(
        res,
        statusCode.created,
        responseStatus.success,
        messages.customerCreated,
        {customerId:newUser.stripeCustomerId,paymentsMethods:[]}    
    );
  } catch (err) {
    return response.HttpResponse(
        res,
        statusCode.serverError,
        responseStatus.failure,
        err.message,
        {}
    )
  }
};


export const retrieveCustomer = async (req, res) => {
  try {
    const data = req.query.data;  
    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);
    console.log("🚀 ~ retrieveCustomer ~ payload:", payload)
    let customerId = payload.customerId;

    const result = await handleCustomerPayload(payload);

    if(!result.data){
      console.log("🚀 ~ retrieveCustomer ~ data:", result.data)
      
      return response.HttpResponse(
                res,
                statusCode.errorPage,
                responseStatus.failure,
                messages.customerNotFound,
                {},
          );
    }


    // if (!customerId){
    //   if(!emailId){
    //     return response.HttpResponse(
    //       res,
    //       statusCode.badRequest,
    //       responseStatus.failure,
    //       messages.emailRequired,
    //       {},
    //   );
    //   }else{
    //     customerId = await findCustomer(emailId);
    //     if(!customerId){
    //       return response.HttpResponse(
    //         res,
    //         statusCode.errorPage,
    //         responseStatus.failure,
    //         messages.customerNotFound,
    //         {},
    //     );
    //     }
    //   }
     
    // }

    customerId = result.data;
    console.log("🚀 ~ retrieveCustomer ~ result.data:", result.data)
    console.log("🚀 ~ retrieveCustomer ~ customerId:", customerId)

    if (!customerId || typeof customerId !== 'string'){
      return response.HttpResponse(
        res,
        statusCode.ok,
        responseStatus.failure,
        messages.customerNotFound,
        {},
    );
    }
    

    const customer = await stripe.customers.retrieve(customerId);
    console.log("🚀 ~ retrieveCustomer ~:", customer)
  
    if (customer){
      return response.HttpResponse(
        res,
        statusCode.ok,
        responseStatus.success,
        messages.customerFound,
        customer,
    );
    }
  }
  catch(err){
    console.log("🚀 ~ retrieveCustomer ~ err:", err)
    if (err.raw && err.raw.statusCode==404){
        return response.HttpResponse(
          res,
          statusCode.errorPage,
          responseStatus.failure,
          messages.customerNotFound,
          {},
      );
    }
      return response.HttpResponse(
        res,
        statusCode.serverError,
        responseStatus.failure,
        err.message,
        {}
    )
    

  }}