import Stripe from 'stripe';
import axios from 'axios';
import { stripeSecretKey, Blockchain_url, AUCTORITAS_USERNAME, AUCTORITAS_PASSWORD } from '../../config/config.js';
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";

const stripe = new Stripe(stripeSecretKey);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handleInvoicePaymentSucceeded = async (invoice) => {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  try {
    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const integraPublicKeyId = subscription.metadata.integraId;
    const tokens = calculateTokens(subscription.items.data);

    // Add tokens to blockchain
    await addTokensToBlockchain(integraPublicKeyId, tokens);
  } catch (err) {
    console.error('Error handling invoice payment succeeded:', err);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  // Handle subscription updates, e.g., renewals
  const integraPublicKeyId = subscription.metadata.integraId;
  const tokens = calculateTokens(subscription.items.data);

  try {
    // Add tokens to blockchain
    await addTokensToBlockchain(integraPublicKeyId, tokens);
  } catch (err) {
    console.error('Error handling subscription updated:', err);
  }
};

const calculateTokens = (subscriptionItems) => {
  // Implement your logic to calculate tokens based on subscription items
  return 10; // Example token calculation
};

const addTokensToBlockchain = async (integraPublicKeyId, tokens) => {
  try {
    let response = await axios.post(`${Blockchain_url}/auctoritas`, {
      username: AUCTORITAS_USERNAME,
      password: AUCTORITAS_PASSWORD
    });

    if (response && response.status === 200 && response.data.message === "success" && response.data.token) {
      const auth_token = response.data.token;

      const addTokenResponse = await axios.post(`${Blockchain_url}/addToken`, {
        IntegraID: integraPublicKeyId,
        Amount: tokens,
        Issue: false
      }, {
        headers: {
          'Authorization': `Bearer ${auth_token}`
        }
      });

      console.log("🚀 ~ addToken response:", addTokenResponse.data);
    } else {
      console.error('Failed to authenticate with blockchain');
    }
  } catch (err) {
    console.error('Error adding tokens to blockchain:', err);
  }
};
