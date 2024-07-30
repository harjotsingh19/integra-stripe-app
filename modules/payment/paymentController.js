
import Stripe from 'stripe';  // Correctly import Stripe
import { stripeSecretKey, Blockchain_url, AUCTORITAS_USERNAME, AUCTORITAS_PASSWORD, TOKEN_PRICE } from '../../config/config.js';  // Import named export
import User from '../../models/userModel.js';
import PaymentIntent from '../../models/paymentIntentModel.js';
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";
import { findCustomer, handleCustomerPayload } from "../../utils/common.js";

import CheckoutSession from '../../models/sessionModel.js'

import axios from 'axios';


const stripe = new Stripe(stripeSecretKey);  // Initialize Stripe with the named export

export const attachPaymentMethod = async (req, res) => {

  try {

    const data = req.query.data;
    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);
    console.log("🚀 ~ attachPaymentMethod ~ payload:", payload)

    const token = payload.token;
    if (!token) {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.tokenNotFound,
        {}
      )
    }
    // const email = payload.email;
    let customerId = payload.customerId;

    const result = await handleCustomerPayload(payload);
    if (!result.data) {
      console.log("🚀 ~ attachPaymentMethod ~ data:", result.data)

      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        messages.customerNotFound,
        {},
      );
    }

    customerId = result.data;
    console.log("🚀 ~ attachPaymentMethod ~ result.data:", result.data)
    console.log("🚀 ~ attachPaymentMethod ~ customerId:", customerId)

    // if (!customerId){
    //   let customer = await User.findOne({ email: email });
    //   customerId = customer.stripeCustomerId;
    // }
    console.log("🚀 ~ attachPaymentMethod ~ token:", token)
    console.log("🚀 ~ attachPaymentMethod ~ customerId:", customerId)

    const method = await stripe.paymentMethods.create({
      type: messages.paymentType,
      card: { token }
    })
    console.log("🚀 ~ attachPaymentMethod ~ method:", method)


    await stripe.paymentMethods.attach(method.id, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: method.id,
      },
    });


    return response.HttpResponse(
      res,
      statusCode.created,
      responseStatus.success,
      messages.paymentAttached,
      { paymentMethod: method },
    );
  } catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};

export const listPaymentMethods = async (req, res) => {
  try {
    const data = req.query.data;

    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);


    let customerId = payload.customerId;
    // const email = payload.email;


    const result = await handleCustomerPayload(payload);

    if (!result.data) {
      console.log("🚀 ~ listPaymentMethods ~ data:", result.data)

      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        messages.customerNotFound,
        {},
      );
    }


    customerId = result.data;
    console.log("🚀 ~ listPaymentMethods ~ result.data:", result.data)
    console.log("🚀 ~ listPaymentMethods ~ customerId:", customerId)
    // if (!customerId){
    //   let customer = await User.findOne({ email: email });
    //   customerId = customer.stripeCustomerId;
    // }
    // console.log("🚀 ~ attachPaymentMethod ~ token:", token)
    console.log("🚀 ~ listPaymentMethods ~ customerId:", customerId)


    const paymentMethods = await stripe.customers.listPaymentMethods(customerId, { type: messages.paymentType });
    console.log("🚀 ~ listPaymentMethods ~ paymentMethods:", paymentMethods)
    return response.HttpResponse(
      res,
      statusCode.created,
      responseStatus.success,
      messages.paymentMethodFound,
      { paymentMethods: paymentMethods },
    );

  } catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};


export const createPaymentIntent = async (req, res) => {
  try {
    const data = req.query.data;
    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);
    console.log("🚀 ~ createPaymentIntent ~ payload:", payload)


    let customerId = payload.customerId;
    const emailId = payload.emailId;
    let amount = payload.amount;
    const amountPerToken = amount;
    const tokens = payload.numberOfTokens
    const integraPublicKeyId = payload.integraPublicKeyId

    if (typeof amount !== 'number' || amount <= 0) {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.amountNotFound,
        {},
      );
    }

    // Validate tokens
    if (!Number.isInteger(tokens) || tokens <= 0) {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.tokensNumbersValid,
        {},
      );
    }


    amount = amount * tokens;
    console.log("🚀 ~ createPaymentIntent ~ amount:", amount)
    console.log("🚀 ~ createPaymentIntent ~ amount:", typeof (amount))


    const result = await handleCustomerPayload(payload);
    console.log("🚀 ~ createPaymentIntent ~ result:", result)

    if (result.data == "") {
      console.log("🚀 ~ createPaymentIntent ~ data:", result.data)

      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        result.message,
        {},
      );
    }

    customerId = result.data;
    console.log("🚀 ~ createPaymentIntent ~ result.data:", result.data)
    console.log("🚀 ~ createPaymentIntent ~ customerId:", customerId)


    // if (!customerId){
    //   let customer = await User.findOne({ email: email });
    //   customerId = customer.stripeCustomerId;
    //   console.log("🚀 ~ createPaymentIntent ~ customerId:", customerId)
    // }

    const paymentMethod = payload.paymentMethodId

    if (!paymentMethod) {
      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        messages.paymentMethodNotAttach,
        {},
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      customer: customerId,
      confirm: true,
      payment_method: paymentMethod,
      // confirmation_method: 'automatic',
      automatic_payment_methods: {
        enabled: true,  // Automatically handle supported payment methods
        allow_redirects: 'never',  // Avoid redirects
      },
      description: `${tokens} Tokens`,
    });

    let message, returnData;
    // Check the status of the payment intent
    switch (paymentIntent.status) {
      case 'succeeded': {
        const unixTimestamp = paymentIntent.created;
        const date = new Date(unixTimestamp * 1000);

        // Store paymentIntent details in the database
        const newPaymentIntent = new PaymentIntent({
          paymentIntentId: paymentIntent.id,
          customerId: customerId,
          emailId: emailId,
          amount: amount,
          paymentDate: date,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          description: paymentIntent.description,
          integraPublicKeyId: integraPublicKeyId,
          numberOfTokens: tokens,
          amountPerToken: amountPerToken,
        });

        await newPaymentIntent.save();

        // message = messages.paymentSuccess


        let response = await axios.post(`${Blockchain_url}/auctoritas`, { username: AUCTORITAS_USERNAME, password: AUCTORITAS_PASSWORD });

        console.log("🚀 ~ createPaymentIntent ~ response:", response.data)
        let auth_token;
        if (response && response.status == '200' && response.data.message == "success" && response.data.token) {
          auth_token = response.data.token
        }


        if (auth_token) {
          const AddTokenResponse = await axios.post(`${Blockchain_url}/addToken`,
            {
              IntegraID: integraPublicKeyId,
              Amount: tokens,
              Issue: false
            },
            {
              headers: {
                'Authorization': `Bearer ${auth_token}`
              }
            }
          );

          console.log("🚀 ~ addToken response:", AddTokenResponse.data);
          // message = messages.paymentSuccess+" "+ "and" messages.tokenAdded
          message = `${messages.paymentSuccess} & ${messages.tokenAdded}`
          returnData = {
            paymentIntent,
            addedTokenData: AddTokenResponse.data
          }

          console.log("🚀 ~ createPaymentIntent ~ returnData:", returnData)

        } else {
          message = messages.paymentSuccess
        }

        // });


        break;

      }
      case 'requires_action':
        message = messages.paymentRequiredAction
        break;
      case 'requires_payment_method':
        message = messages.paymentMethodNotAttach
        break;
      case 'requires_confirmation':
        message = messages.paymentReadyToConfirmed
        break;
      case 'requires_capture':
        return response.HttpResponse(
          res,
          statusCode.ok,
          responseStatus.success,
          messages.paymentFurtherAction + `:-${paymentIntent.status}`,
          paymentIntent,
        );
      case 'canceled':
        return response.HttpResponse(
          res,
          statusCode.ok,
          responseStatus.success,
          messages.paymentCanceled,
          paymentIntent,
        );

      case 'processing':
        message = messages.paymentProcessing
        break;

      default:
        return response.HttpResponse(
          res,
          statusCode.badRequest,
          responseStatus.failure,
          messages.paymentFailed + `:-${paymentIntent.status}`,
          paymentIntent,
        );
    }

    if (returnData) {
      console.log("🚀 ~ createPaymentIntent ~ returnData:", "inside return data ")

      return response.HttpResponse(
        res,
        statusCode.ok,
        responseStatus.success,
        message,
        returnData,
      );
    }
    console.log("🚀 ~ createPaymentIntent ~ returnData:", "outside return data ")
    return response.HttpResponse(
      res,
      statusCode.ok,
      responseStatus.success,
      message,
      paymentIntent,
    );
  } catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};



export const getTokenPrice = async (req, res) => {
  try {
      const tokenInfo = {
      tokenPrice: TOKEN_PRICE,
    };
      console.log("🚀 ~ getTokenPrice ~ tokenInfo:", tokenInfo)
   
    if (tokenInfo.tokenPrice){
        console.log("insid eif");
        return response.HttpResponse(
            res,
            statusCode.ok,
            responseStatus.success,
            messages.tokenPriceFound,
            {tokenPrice:tokenInfo.tokenPrice}
        )
    }
    return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.tokenPriceNotFound,
        {}
    )
  } catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};

export const confirmPayment = async (req, res) => {


  try {
    const data = req.query.data;
    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);
    console.log("🚀 ~ createPaymentIntent ~ payload:", payload)


    let paymentId = payload.paymentId;
    console.log("🚀 ~ confirmPayment ~ paymentId:", paymentId)
    const paymentMethodId = payload.paymentMethodId;
    console.log("🚀 ~ confirmPayment ~ paymentMethodId:", paymentMethodId)


    const intent = await stripe.paymentIntents.confirm(paymentId, { payment_method: paymentMethodId, return_url: 'http://localhost.com' });

    if (!intent) {
      return response.HttpResponse(
        res,
        statusCode.serverError,
        responseStatus.failure,
        "Red aaaaaaaaaaa",
        {}
      )
    }

    // Update payment intent status in the database
    await PaymentIntent.updateOne(
      { paymentIntentId: paymentId },
      { status: intent.status },
    );

    return response.HttpResponse(
      res,
      statusCode.created,
      responseStatus.success,
      messages.paymentAttached,
      intent,
    );
  } catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};


export const retreivePayment = async (req, res) => {
  try {
    const data = req.query.data;
    const jsonString = atob(data);
    const payload = JSON.parse(jsonString);
    console.log("🚀 ~ retrievePaymentIntent ~ payload:", payload)


    let paymentId = payload.paymentId;
    if (!paymentId) {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.enterRequiredData + ":- paymentId not found",
        {},
      );
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentId
    );
    console.log("🚀 ~ retreivePayment ~ paymentIntent:", paymentIntent)

    if (paymentIntent) {
      return response.HttpResponse(
        res,
        statusCode.ok,
        responseStatus.success,
        messages.paymentNotFound,
        paymentIntent,
      );
    }
  }
  catch (err) {
    console.log("🚀 ~ retreivePayment ~ err:", err.raw.statusCode)
    if (err.raw.statusCode == 404) {
      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        messages.paymentNotFound,
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
  }


}

export const paymentSession = async (req, res) => {


  const data = req.query.data;

  const jsonString = atob(data);
  const payload = JSON.parse(jsonString);

  const tokens = payload.tokens;
  const email = payload.email;

  // const email = payload.emailId;
  // if (!email){
  //   return response.HttpResponse(
  //     res,
  //     statusCode.badRequest,
  //     responseStatus.failure,
  //     messages.emailRequired,
  //     {},
  // );
  // }
  let amount = payload.amount;

  console.log("🚀 ~ paymentSession ~ tokens type:", typeof (tokens))

  if (typeof amount !== 'number' || amount <= 0) {
    return response.HttpResponse(
      res,
      statusCode.badRequest,
      responseStatus.failure,
      messages.amountNotFound,
      {},
    );
  }

  // Validate tokens
  if (!Number.isInteger(tokens) || tokens <= 0) {

    return response.HttpResponse(
      res,
      statusCode.badRequest,
      responseStatus.failure,
      messages.tokensNumbersValid,
      {},
    );
  }

  console.log("🚀 ~ paymentSession ~ tokens type:", typeof (tokens))
  console.log("🚀 ~ paymentSession ~ tokens:", tokens)
  console.log("🚀 ~ paymentSession ~ amount:", amount)

  amount *= tokens

  console.log("🚀 ~ paymentSession ~ amount:", amount)

  const integraPublicKeyId = payload.integraPublicKeyId;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tokens} token`
          },
          unit_amount: amount * 100
        },
        quantity: tokens
      }
    ],
    mode: 'payment',
    success_url: `${process.env.FRONT_END_BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONT_END_BASE_URL}/cancel`,
    customer_email: email
  });
  console.log("🚀 ~ paymentSession ~ session:", session)

  // res.json({ url: session.url });
  res.json({ url: session.url });
  return response.HttpResponse(
    res,
    statusCode.ok,
    responseStatus.success,
    messages.urlredirected,
    url,
  );
}



export const verifyPayment = async (req, res) => {
  const { sessionId } = req.query;

  try {
    // Retrieve the session details from Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("🚀 ~ verifyPayment ~ stripeSession:", stripeSession);

    // Verify the payment status
    if (stripeSession.payment_status === 'paid') {
      // Create a new CheckoutSession document
      const checkoutSession = new CheckoutSession({
        id: stripeSession.id,
        object: stripeSession.object,
        amount_subtotal: stripeSession.amount_subtotal,
        amount_total: stripeSession.amount_total,
        created: new Date(stripeSession.created * 1000), // Convert from timestamp to Date
        currency: stripeSession.currency,
        customer: stripeSession.customer,
        customer_creation: stripeSession.customer_creation,
        customer_details: stripeSession.customer_details,
        expires_at: new Date(stripeSession.expires_at * 1000), // Convert from timestamp to Date
        livemode: stripeSession.livemode,
        mode: stripeSession.mode,
        payment_intent: stripeSession.payment_intent,
        payment_method_options: stripeSession.payment_method_options,
        payment_method_types: stripeSession.payment_method_types,
        payment_status: stripeSession.payment_status,
        status: stripeSession.status,
        success_url: stripeSession.success_url
      });

      // Save the document to MongoDB
      await checkoutSession.save();

      return response.HttpResponse(
        res,
        statusCode.accepted,
        responseStatus.success,
        messages.paymentSuccess,
        { stripeSession: stripeSession, success: true }
      );

      // res.json({ success: true });

    } else {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.paymentfailed,
        { stripeSession: stripeSession, success: false },
      );
    }
  } catch (error) {
    console.error('Error retrieving session:', error);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      error.message,
      {}
    )
  }

};
