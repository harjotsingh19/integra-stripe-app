
import Stripe from 'stripe';  
import { stripeSecretKey,FRONT_END_BASE_URL } from '../../config/config.js'; 
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";


import subscriptionSession from '../../models/subscriptionSession.js'

const stripe = new Stripe(stripeSecretKey); 

export const paymentSession = async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation
    if (!payload.priceId || typeof payload.priceId !== 'string') {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.priceIdNotFound,
        {}
      );
    }

    const emailId = payload.emailId;
    const integraPublicKeyId = payload.integraPublicKeyId;
    console.log("🚀 ~ paymentSession ~ integraPublicKeyId:", integraPublicKeyId)
    if (!payload.integraPublicKeyId || typeof payload.integraPublicKeyId !== 'string') {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.integraPublicKeyIdNotFound,
        {}
      );
    }


    const tokens = payload.tokens;

    if (!Number.isInteger(tokens) || tokens <= 0) {

      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.tokensNumbersValid,
        {},
      );
    }


    const priceId = payload.priceId;
    const name = payload.name || '';
    const organizationid = payload.organizationid || '';


    console.log("🚀 ~ paymentSession ~ priceId:", priceId);
    console.log("🚀 ~ paymentSession ~ organizationid:", organizationid);


    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${FRONT_END_BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONT_END_BASE_URL}/cancel`,
      customer_email: emailId,
      metadata: {
        organizationId: organizationid,
        name: name,
        IntegraId: integraPublicKeyId,
        emailId: emailId,
        tokens: tokens,
        priceId: priceId
      },
    });

    console.log("🚀 ~ paymentSession ~ session:", session);


    const paymentData = {
      sessionId: session.id,
      created: session.created,
      currency: session.currency,
      status: session.status,
      customerId: session.customer,
      customerEmail: session.customer_details.email,
      paymentIntent: session.payment_intent,
      payment_status: session.payment_status,
      invoiceId: session.invoice,
      metadata: session.metadata,
      mode: session.mode,
    }

    const payment = new subscriptionSession(paymentData);
    await payment.save();

    // res.json({ url: session.url });
    return response.HttpResponse(
      res,
      statusCode.created,
      responseStatus.success,
      messages.urlredirected,
      {url:session.url}
    );
  } catch (err) {
    console.error('Error creating Checkout Session:', err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    );
  }
};


export const verifyPayment = async (req, res) => {
  const { sessionId } = req.query;

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status === 'paid') {
      return response.HttpResponse(
        res,
        statusCode.accepted,
        responseStatus.success,
        messages.paymentSuccess,
        { success: true }
      );
    } else {
      return response.HttpResponse(
        res,
        statusCode.badRequest,
        responseStatus.failure,
        messages.paymentfailed,
        { success: false },
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
