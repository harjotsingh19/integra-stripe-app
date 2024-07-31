import Stripe from 'stripe';
import axios from 'axios';
import { stripeSecretKey, Blockchain_url, AUCTORITAS_USERNAME, AUCTORITAS_PASSWORD, STRIPE_WEBHOOK_SECRET } from '../../config/config.js';
import SubscriptionPlan from '../../models/subscriptionPlans.js';
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";

import WebhookEvent from '../../models/webhookEvents.js'

// Initialize Stripe with your secret key
const stripe = new Stripe(stripeSecretKey); // Replace with your Stripe secret key

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body; 
  console.log("TCL: handleStripeWebhook -> rawBody", rawBody)

  let event;

  try {
    // Construct the event with raw body and signature
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET); 
    const eventId = event.id;
		console.log("TCL: handleStripeWebhook -> event.id", event.id)
    console.log("TCL: handleStripeWebhook -> event", event.type)
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({
      status: responseStatus.failure,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event based on its type
  // Handle the event based on its type
  switch (event.type) {
    // case 'invoice.payment_succeeded':

    //   console.log("TCL: handleStripeWebhook 111111111 -> event.id", event.id)
      // console.log("event id 1111 ",eventId);
    case 'invoice.payment_succeeded':
      
      console.log("TCL: handleStripeWebhook 222222222222222 -> event.id", event.id)
      const session = event.data.object;
			console.log("TCL: handleStripeWebhook -> session", session)
      // console.log("TCL: handleStripeWebhook -> session", session
      try {

        // Extract the subscription ID from the session
        const subscriptionId = session.subscription;
        console.log("TCL: handleStripeWebhook -> subscriptionId", subscriptionId)

        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
				console.log("TCL: handleStripeWebhook -> subscription", subscription)
        console.log("subscription data ", subscription.items.data);
        const priceId = subscription.items.data[0].price.id; // Get the price ID from subscription

        // Fetch subscription plan details from the database using priceId
        let subscriptionPlan = await SubscriptionPlan.findOne({ priceId: priceId });

        if (!subscriptionPlan) {
          console.log('Subscription plan not found for priceId:', priceId);
          return res.status(400).json({
            status: responseStatus.failure,
            message: 'Subscription plan not found',

          });
        }
        const tokens = subscriptionPlan.numberOfTokens;
        console.log("TCL: handleStripeWebhook -> tokens", tokens)
        const integraPublicKeyId = session.metadata.IntegraId;


       let eventId = event.id
				console.log("TCL: handleStripeWebhook -> eventId", eventId)
        const eventType = event.type;

        // Store the event details in the database
        const webhookEvent = new WebhookEvent({
          eventId,
          eventType,
          eventData: event.data.object,
          tokensInPlan:tokens
        });

        try {
          await webhookEvent.save();
        } catch (dbError) {
          console.error('Error saving event to database:', dbError);
          return res.status(500).json({ status: 'failure', message: 'Error saving event to database' });
        }


        // Check if the event has already been processed
        const existingEvent = await WebhookEvent.findOne({ eventId, tokenAdded: true });
        if (existingEvent) {
          console.log('Event already processed , tokens added:', eventId);
          return res.status(200).json({ status: 'success', message: 'payment done successfully and tokens already added.',tokenReceived:true});
          // return res.json({ received: true });
        }



        // Authenticate with the blockchain
        let auth_token;
        try {
          const authResponse = await axios.post(`${Blockchain_url}/auctoritas`, {
            username: AUCTORITAS_USERNAME,
            password: AUCTORITAS_PASSWORD
          });
          console.log("TCL: handleStripeWebhook -> authResponse", authResponse.status)

          if (authResponse && authResponse.status === 200 && authResponse.data.message === "success" && authResponse.data.token) {
            auth_token = authResponse.data.token;
						console.log("TCL: handleStripeWebhook -> auth_token", auth_token)
          } else {
            return res.status(500).json({ status: 'failure', message: 'Error getting authentication token',data:{} });
          }
        } catch (authError) {
          console.error('Authentication error:', authError);
          return res.status(500).json({
            status: responseStatus.failure,
            message: 'Failed to authenticate with blockchain',
            data:{}
          });
        }
        console.log("auth_token", auth_token);

        console.log('Payload:', {
          IntegraID: integraPublicKeyId,
          Amount: tokens,
          Issue: false
        });
        // Add tokens to blockchain
        try {
          const addTokenResponse = await axios.post(`${Blockchain_url}/addToken`, {
            IntegraID: integraPublicKeyId,
            Amount: tokens,
            Issue: false
          }, {
            headers: {
              'Authorization': `Bearer ${auth_token}`
            }
          });

          delete addTokenResponse.data.KeyValue
          console.log("🚀 ~ addToken response:", addTokenResponse.data);


          await WebhookEvent.updateOne({ eventId }, {$set: { // Use $set to update multiple fields
            // tokenInPlan: numberOfTokens,
            integraPublicKeyData: addTokenResponse.data,tokenAdded: true} 
          });

          return res.status(200).json({ status: 'success', message: `tokens added successfully to ${integraPublicKeyId}`,tokenReceived:true});
          
        } catch (tokenError) {
          console.error('Error adding tokens to blockchain:', tokenError);
          return res.status(500).json({
            status: responseStatus.failure,
            message: 'Failed to add tokens to blockchain',
            error:tokenError
          });
        }

        
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({
          status: responseStatus.failure,
          message: 'Database error',
          data:{}
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      res.status(400).end();
  }












}
