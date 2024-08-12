import express from 'express';
import { handleStripeWebhook } from './webhookController.js'; // Adjust the path as needed


const router = express.Router();

// Use body-parser raw middleware for Stripe webhook
router.post('/stripe', handleStripeWebhook);

export default router;
