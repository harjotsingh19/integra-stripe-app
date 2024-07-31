import express from 'express';
import { handleStripeWebhook } from './webhookController.js';

const router = express.Router();

// Stripe webhook route
router.post('/stripe', handleStripeWebhook);

export default router;
