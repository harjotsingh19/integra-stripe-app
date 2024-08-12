import Stripe from 'stripe';
import axios, { HttpStatusCode } from 'axios';
import { stripeSecretKey, Blockchain_url, AUCTORITAS_USERNAME, AUCTORITAS_PASSWORD, STRIPE_WEBHOOK_SECRET } from '../../config/config.js';
import SubscriptionPlan from '../../models/subscriptionPlans.js';
import subscriptionSession from '../../models/subscriptionSession.js'
// import { responseStatus } from "../../core/constants/constant.js";
import SubscriptionRenewal from "../../models/subscriptionRenewal.js"
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";
// import { response } from 'express';
import response from "../../responseHandler/response.js";



// Initialize Stripe with your secret key
const stripe = new Stripe(stripeSecretKey); // Replace with your Stripe secret key

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log("🚀 ~ handleStripeWebhook ~ sig:", sig)
  const rawBody = req.body;
  console.log("TCL: handleStripeWebhook -> rawBody", rawBody)

  let event;
  try {

    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    const eventId = event.id;


    console.log("TCL: handleStripeWebhook -> event.type", event.type)
    switch (event.type) {

      case 'customer.subscription.updated': {
        console.log("inside subscription updated");

        const dbConnection = await checkDatabaseConnection();
        console.log("🚀 ~ handleStripeWebhook ~ dbConnection:", dbConnection)
        if (!dbConnection.status == responseStatus.success){
          console.log("🚀 ~ handleStripeWebhook ~ db connection failure",dbConnection.message)
          return res.status(statusCode.serverError).json({ status: responseStatus.failure, message: dbConnection.message });
        }
        
        console.log("event data");
        console.log(event.data.object);

        const updatedSubscription = event.data.object;
        const subscriptionId = updatedSubscription.id;
        const renewalId = event.id;
        console.log("🚀 ~ renewalId:", renewalId)
        const invoiceId = updatedSubscription.latest_invoice;


        // Check if the subscription is for first time

        const previousRenewal = await SubscriptionRenewal.findOne({ subscriptionId }).sort({ renewalDate: -1 });

        console.log("🚀 ~ handleStripeWebhook ~ previousRenewal:", previousRenewal)



        if (previousRenewal?.renewalDate <= 0 || previousRenewal?.renewalDate == null) {
          console.log("🚀 ~ handleStripeWebhook ~ previousRenewal?.renewalDate:", previousRenewal?.renewalDate)
          console.log("");
          console.log('No previous renewal found,its a first time subscription');
          return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.firstTimeSubscription });
        }


        console.log("");

        console.log("previous renewal date", previousRenewal.renewalDate);
        if (previousRenewal.subscriptionType == 'first_time') {
          console.log("inside subscription check first time or renew");

          // check if first time subscription is trying to get updated again
          if (updatedSubscription.current_period_start == previousRenewal.subscriptionDetails.currentPeriodStart && updatedSubscription.current_period_end == previousRenewal.subscriptionDetails.currentPeriodEnd
          ) {
            console.log("insoide subscription comparison , both have same start and end period");
            console.log("🚀 ~ handleStripeWebhook ~ previousRenewal.subscriptionType :", previousRenewal.subscriptionType)
            console.log('Not a renewal or already processed');
            return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.firstTimeSubscription });
          }

          console.log("subscription is renewing");

        } else {
          console.log("subscription is renewing, it is also renewed before this.");
        }

        console.log("");
        console.log("🚀 ~ handleStripeWebhook ~ currentPeriodStart:", updatedSubscription.current_period_start)
        console.log("");


        const currentPeriodEnd = updatedSubscription.current_period_end;
        console.log("🚀 ~ handleStripeWebhook ~ currentPeriodEnd:", currentPeriodEnd);

        // Check if this renewal has already been processed
        const existingRenewal = await SubscriptionRenewal.findOne({ renewalId });
        console.log("🚀 ~ existingRenewal:", existingRenewal)
        console.log("🚀 ~ handleStripeWebhook ~ existingRenewal.tokensCredited:", existingRenewal?.tokensCredited)


        // Fetch the existing subscription record
        let sessionData = await subscriptionSession.findOne({ 'subscriptionDetails.subscriptionId': subscriptionId });
        console.log("🚀 ~ handleStripeWebhook ~ sessionData:", sessionData)

        if (!sessionData) {
          return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.subscriptionNotFoundWithSession });
        }


        const sessionId = sessionData.sessionId;

        let integraPublicKeyId = sessionData.metadata.IntegraId;

        if (existingRenewal && existingRenewal.tokensCredited) {
          
          console.log("🚀 ~ handleStripeWebhook ~ existingRenewal:", existingRenewal?.integraPublicKeyData)

          // const timeNow = Math.floor(Date.now() / 1000)
          if (existingRenewal?.integraPublicKeyData?.lastTokensAddedTime > 0) {
            console.log(`lastTokensAddedTime is positive greater than 0 :- ${messages.tokensAlreadyAdded}`);
            return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.tokensAlreadyAdded })
          }

          console.log("Renewal already completed");
          return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.tokensAlreadyAdded });
        }

        console.log('Subscription Renewal not already processed');



        // Fetch the latest invoice details if needed
        const invoice = await stripe.invoices.retrieve(invoiceId);

        if (invoice.paid) {
          const priceId = updatedSubscription.plan.id;
          const subscriptionPlan = await SubscriptionPlan.findOne({ priceId });

          if (!subscriptionPlan) {
            console.log('Subscription plan not found for priceId:', priceId);
            return res.status(statusCode.badRequest).json({
              status: responseStatus.failure,
              message: messages.subscriptionPlanNotFound,
            });
          }

          const tokens = subscriptionPlan.numberOfTokens || 0; 
          console.log("🚀 ~ numbers of tokens to add :", tokens)
          if (!Number.isInteger(tokens) || tokens <= 0) {

            return response.HttpResponse(
              res,
              statusCode.badRequest,
              responseStatus.failure,
              messages.tokensNumbersValid,
              {},
            );
          }

         
          const newRenewal = await SubscriptionRenewal.findOneAndUpdate({ renewalId: renewalId }, {
            $set: {
              subscriptionId: subscriptionId,
              renewalDate: Math.floor(Date.now() / 1000),
              customerId: invoice.customer,
              sessionId: sessionId,
              paid: invoice.paid,
              priceId: priceId,
              subscriptionType: 'renew',
              invoiceDetails: {
                invoiceId: invoice.id,
                amountDue: invoice.amount_due / 100,
                amountPaid: invoice.amount_paid / 100,
                created: invoice.created,
                currency: invoice.currency,
                customerId: invoice.customer,
                customerEmail: invoice.customer_email,
                customerName: invoice.customer_name,
                invoiceUrl: invoice.url,
                invoicePdf: invoice.pdf_url,
                paid: invoice.paid,
                paymentIntent: invoice.payment_intent,
                status: invoice.status,
                statementDescriptor: invoice.statement_descriptor,
                subtotal: invoice.subtotal / 100,
                total: invoice.total / 100
              },
              subscriptionDetails: {
                subscriptionId: updatedSubscription.id,
                created: updatedSubscription.created,
                currency: updatedSubscription.currency,
                status: updatedSubscription.status,
                currentPeriodStart: updatedSubscription.current_period_start,
                currentPeriodEnd: updatedSubscription.current_period_end,
                startDate: updatedSubscription.start_date,
                customerId: updatedSubscription.customer,
                defaultPaymentMethod: updatedSubscription.default_payment_method,
                latestInvoice: updatedSubscription.latest_invoice,
                items: updatedSubscription.items,
                planDetails: {
                  planId: updatedSubscription.plan.id,
                  created: updatedSubscription.plan.created,
                  currency: updatedSubscription.plan.currency,
                  interval: updatedSubscription.plan.interval,
                  intervalCount: updatedSubscription.plan.interval_count,
                  tokens: updatedSubscription.plan.tokens,
                  product: updatedSubscription.plan.product,
                  amount: updatedSubscription.plan.amount / 100,
                  quantity: updatedSubscription.plan.quantity,
                },
              },
            },
          }, { upsert: true, 'new': true });


          console.log('Created new renewal record:', newRenewal);



          // Credit tokens if not already credited in this event or  on calling event again
          if (!newRenewal.tokensCredited) {
            console.log("inside credit tokens subscription renew");
            const tokenInfo = await creditTokens(sessionData.metadata.IntegraId, tokens);
            console.log("🚀 ~ handleStripeWebhook ~ tokenInfo:", tokenInfo)

            if (tokenInfo.statusCode == statusCode.ok && tokenInfo.data) {
              console.log("🚀 ~ handleStripeWebhook ~ tokenInfo.data:", tokenInfo.data)
              console.log("🚀 ~ handleStripeWebhook ~ tokenInfo.statusCode:", tokenInfo.statusCode)

              await SubscriptionRenewal.findOneAndUpdate(
                { renewalId },
                { $set: { tokensCredited: true, integraPublicKeyData: tokenInfo.data } },
                { new: true }
              );

              console.log(`Tokens credited for : ${integraPublicKeyId} in renewalId : ${renewalId}`);
            } else {
              console.log("token not added", tokenInfo);
              return response.HttpResponse(
                res,
                tokenInfo.statusCode,
                responseStatus.failure,
                tokenInfo.message,
                tokenInfo.data
              );

            }
          } else {
            console.log(`tokens already credited to ${integraPublicKeyId} in this renew event :- ${renewalId}`);
          }

        } else {
          console.log("invoice paid status is false , so payment is still in pending state , tokens will be added later");
          return res.status(statusCode.errorPage).json({
            responseStatus: responseStatus.failure,
            message: messages.invoiceFalseStatus
          });
        }

        
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        // console.log("TCL: handleStripeWebhook -> session", session)
        console.log("inside Session");


        await checkDatabaseConnection();
        console.log("")
        console.log("TCL: handleStripeWebhook -> event.id", event.id)
        console.log("");
        console.log("TCL: handleStripeWebhook -> event", event.type)
        console.log("");

        const sessionId = session.id


        let metadata, updatedPayment, integraPublicKeyId, isTokenCredited;
        let invoiceId = session.invoice;
        // console.log("TCL: handleStripeWebhook -> session", session.invoice)

        console.log("");
        const invoice = await stripe.invoices.retrieve(invoiceId);
        // console.log("TCL: handleStripeWebhook -> invoice", invoice)

        console.log("");
        metadata = session.metadata;
        console.log('Session metadata:', metadata);

        console.log("");
     

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        console.log("");
      
        console.log("");
       

        console.log("");

        const priceId = subscription.plan.id;


        let sessionData;
        if (invoice.paid) {


          sessionData = await subscriptionSession.findOne({ sessionId: sessionId });
          console.log("🚀 ~ handleStripeWebhook ~ sessionData1:", sessionData)
          console.log("");


          if (!sessionData) {
            console.log('session data not found');
            return res.status(400).json({
              status: responseStatus.failure,
              message: 'session data not found',

            });
          }


   
          integraPublicKeyId = sessionData.metadata.IntegraId;
          console.log("");
          console.log("TCL: handleStripeWebhook -> integraPublicKeyId", integraPublicKeyId)
          console.log("");
          isTokenCredited = sessionData.isTokenCredited;
          console.log("istokencredited :- ", isTokenCredited);
          console.log("");





          if (!isTokenCredited) {


            // const timeNow = Math.floor(Date.now() / 1000)
            if (sessionData?.integraPublicKeyData?.lastTokensAddedTime > 0) {
              console.log(`timenow condition check result ,last token added value greater than 0:- ${messages.tokensAlreadyAdded}`);
              return res.status(statusCode.ok).json({ status: responseStatus.success, message: messages.tokensAlreadyAdded })
            }


            let subscriptionPlan = await SubscriptionPlan.findOne({ priceId: priceId });

            if (!subscriptionPlan) {
              console.log("");
              console.log('Subscription plan not found for priceId:', priceId);
              console.log("");
              return res.status(400).json({
                status: responseStatus.failure,
                message: 'Subscription plan not found',

              });
            }
            const tokens = subscriptionPlan.numberOfTokens || metadata.tokens;
            if (!Number.isInteger(tokens) || tokens <= 0) {

              return response.HttpResponse(
                res,
                statusCode.badRequest,
                responseStatus.failure,
                messages.tokensNumbersValid,
                {},
              );
            }
            console.log("");
            console.log("TCL: handleStripeWebhook -> tokens", tokens)
            console.log("");
            console.log("metadata", metadata);





            updatedPayment = await subscriptionSession.findOneAndUpdate(
              { sessionId: sessionId },
              {
                $set: {
                  customerId: session.customer,
                  eventId: event.id,
                  eventType: event.type,
                  paymentIntent: session.payment_intent,
                  payment_status: "paid",
                  status: session.status,
                  priceId: priceId,
                  invoiceId: session.invoice,
                  invoiceDetails: {
                    invoiceId: invoice.id,
                    amountDue: invoice.amount_due / 100,
                    amountPaid: invoice.amount_paid / 100,
                    created: invoice.created,
                    currency: invoice.currency,
                    customer: invoice.customer,
                    customerEmail: invoice.customer_email,

                    customerName: invoice.customer_name,
                    InvoiceUrl: invoice.hosted_invoice_url,
                    invoicePdf: invoice.invoice_pdf,
                    status: invoice.status,
                    paid: invoice.paid,
                    payment_intent: invoice.payment_intent,
                    subtotal: invoice.subtotal / 100,
                    total: invoice.total / 100
                  }
                  , subscriptionDetails: {
                    subscriptionId: invoice.subscription,
                    created: subscription.created,
                    currency: subscription.currency,
                    status: subscription.status,
                    currentPeriodStart: subscription.current_period_start,
                    currentPeriodEnd: subscription.current_period_end,
                    startDate: subscription.start_date,
                    customerId: subscription.customer,
                    default_payment_method: subscription.default_payment_method,
                    latest_invoice: subscription.latest_invoice,
                    items: subscription.items
                    , planDetails: {
                      planId: subscription.plan.id,
                      created: subscription.plan.created,
                      currency: subscription.plan.currency,
                      interval: subscription.plan.interval,
                      interval_count: subscription.plan.interval_count,
                      tokens: tokens,
                      product: subscription.plan.product,
                      amount: subscription.plan.amount / 100,
                      quantity: subscription.plan.quanitity
                    }
                  },
                }
              },
              { new: true }
            );


            console.log("");


            const renewalId = event.id;
            const newRenewal = await SubscriptionRenewal.findOneAndUpdate({ renewalId: renewalId }, {
              $set: {
                subscriptionId: invoice.subscription,
                renewalDate: Math.floor(Date.now() / 1000),
                sessionId: sessionId,
                paid: invoice.paid,
                priceId: priceId,
                customerId: invoice.customer,
                subscriptionType: 'first_time',
                invoiceDetails: {
                  invoiceId: invoice.id,
                  amountDue: invoice.amount_due / 100,
                  amountPaid: invoice.amount_paid / 100,
                  created: invoice.created,
                  currency: invoice.currency,
                  customerId: invoice.customer,
                  customerEmail: invoice.customer_email,
                  customerName: invoice.customer_name,
                  invoiceUrl: invoice.url,
                  invoicePdf: invoice.pdf_url,
                  paid: invoice.paid,
                  paymentIntent: invoice.payment_intent,
                  status: invoice.status,
                  statementDescriptor: invoice.statement_descriptor,
                  subtotal: invoice.subtotal / 100,
                  total: invoice.total / 100
                }, subscriptionDetails: {
                  subscriptionId: invoice.subscription,
                  created: subscription.created,
                  currency: subscription.currency,
                  status: subscription.status,
                  startDate: subscription.start_date,
                  customerId: subscription.customer,
                  defaultPaymentMethod: subscription.default_payment_method,
                  latestInvoice: subscription.latest_invoice,
                  items: subscription.items,
                  planDetails: {
                    planId: subscription.plan.id,
                    created: subscription.plan.created,
                    currency: subscription.plan.currency,
                    interval: subscription.plan.interval,
                    intervalCount: subscription.plan.interval_count,
                    tokens: subscription.plan.tokens,
                    product: subscription.plan.product,
                    amount: subscription.plan.amount / 100,
                    quantity: subscription.plan.quantity,
                  },
                },
              },
            }, { upsert: true, 'new': true })



            console.log("inside credite tokens");


            const tokenInfo = await creditTokens(integraPublicKeyId, tokens);

            if (tokenInfo.statusCode == statusCode.ok && tokenInfo.data) {

              const data = tokenInfo.data

              console.log("🚀 ~ handleStripeWebhook ~ tokenInfo:", tokenInfo)


              const updatedToken = await subscriptionSession.findOneAndUpdate(
                { sessionId: sessionId }, // Query
                {
                  $set: {
                    isTokenCredited: true,
                  }
                },
                { new: true }
              );

              const updatedTokenInfo = await subscriptionSession.findOneAndUpdate(
                { sessionId: sessionId }, 
                {
                  $set: {
                    integraPublicKeyData: tokenInfo.data
                  }

                },
                { new: true }
              );


              const updatedTokenRenewal = await SubscriptionRenewal.findOneAndUpdate(
                { renewalId: renewalId }, // Query
                {
                  $set: {
                    tokensCredited: true,
                    'subscriptionDetails.currentPeriodStart': subscription.current_period_start,
                    'subscriptionDetails.currentPeriodEnd': subscription.current_period_end,
                    integraPublicKeyData: tokenInfo.data,
                  }
                },

                { new: true }
              );
              console.log("");

              console.log("tokens added in blockchain for integrapublic key ", integraPublicKeyId);
              console.log("");
              console.log("updated db", updatedPayment);
              console.log("");
              console.log(`${tokens} tokens added successfully to ${integraPublicKeyId}`);
              return response.HttpResponse(
                res,
                statusCode.accepted,
                responseStatus.success,
                tokenInfo.message,
                tokenInfo.data
              );

            } else {
              console.log("token not added", tokenInfo);
              return response.HttpResponse(
                res,
                tokenInfo.statusCode,
                responseStatus.failure,
                tokenInfo.message,
                tokenInfo.data
              );

            }

          } else {
            console.log("");
            console.log("tokens already added in blockchain", integraPublicKeyId);
          }
        } else {
          console.log("invoice paid status is false , so payment is still in pending state , tokens will be added later");
          return res.status(statusCode.errorPage).json({
            responseStatus: responseStatus.failure,
            message: messages.invoiceFalseStatus
          });
        }

      }

        break;


      default:
        console.log(`Unhandled event type ${event.type}`);
        return res.status(400).end();

    }

    return res.status(200).json({ statusCode: 200, received: true, message: "token added successfully" });
  } catch (err) {
    console.error('Webhook error found:', err.message);
    return res.status(400).json({
      responseStatus: false,
      message: `Webhook Error found: ${err.message}`,
    });
  }


  async function creditTokens(integraPublicKeyId, tokens) {
    try {
      let auth_token;

      const authResponse = await axios.post(`${Blockchain_url}/auctoritas`, {
        username: AUCTORITAS_USERNAME,
        password: AUCTORITAS_PASSWORD
      });
      console.log("TCL: handleStripeWebhook -> authResponse", authResponse.status)

      if (authResponse && authResponse.status === 200 && authResponse.data.message === "success" && authResponse.data.token) {
        console.log("inside auctroritas if condition");
        auth_token = authResponse.data.token;
        console.log("TCL: handleStripeWebhook -> auth_token", auth_token)
      } else {
        return { statusCode: statusCode.serverError, status: responseStatus.failure, message: messages.authenticationTokenFailure, data: {} };

      }
      console.log("");

      console.log("auth_token", auth_token);

      console.log("");

      console.log('Payload:', {
        IntegraID: integraPublicKeyId,
        Amount: tokens,
        Issue: false
      });
      // Add tokens to blockchain



      const lastTokensAddedTime = Math.floor(Date.now() / 1000)
      console.log("🚀 ~ creditTokens ~ lastTokensAddedTime:", lastTokensAddedTime)
      const addTokenResponse = await axios.post(`${Blockchain_url}/addToken`, {
        IntegraID: integraPublicKeyId,

        Amount: tokens,
        Issue: false,
        lastTokensAddedTime: lastTokensAddedTime


      }, {
        headers: {
          'Authorization': `Bearer ${auth_token}`
        }
      });



      console.log("");
      delete addTokenResponse.data.data.KeyValue
      console.log("🚀 ~ addToken response:", addTokenResponse.data);
      console.log("");

      let tokenAddedDate = Date.now()
      console.log("🚀 ~ handleStripeWebhook ~ tokenAddedDate:", tokenAddedDate)
      addTokenResponse.data.data.tokenAdditionTime = tokenAddedDate;
      console.log("");

      console.log("🚀 ~ handleStripeWebhook ~ addTokenResponse.data.data:", addTokenResponse.data.data)
      return { statusCode: statusCode.ok, status: responseStatus.success, message: `${messages.tokenAdded} ${integraPublicKeyId}`, data: addTokenResponse.data.data }
    } catch (error) {
      return { statusCode: statusCode.serverError, status: responseStatus.failure, message: error.message, data: {} }
    }

  }

  async function checkDatabaseConnection() {
    try {
      // Assuming `subscriptionSession` is your MongoDB collection
      // Run a simple command or query to check connection
      await subscriptionSession.findOne({});
      await SubscriptionRenewal.findOne({});
      return { statusCode: statusCode.ok, status: responseStatus.success, message: "Connected to database", data: {} }
    } catch (error) {
      console.error('Database connection failed:', error);
       return { statusCode: statusCode.serverError, status: responseStatus.failure, message: error.message, data: {} }
    }
  }







}