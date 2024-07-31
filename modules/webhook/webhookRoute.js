import express from 'express';
import bodyParser from 'body-parser';
import { handleStripeWebhook } from './webhookController.js'; // Adjust the path as needed
import { STRIPE_WEBHOOK_SECRET } from '../../config/config.js'; // Adjust the path as needed

const router = express.Router();

// Use body-parser raw middleware for Stripe webhook
router.post('/stripe', handleStripeWebhook);

export default router;
