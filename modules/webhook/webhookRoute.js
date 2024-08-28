import express from 'express';
import { handleStripeWebhook } from './webhookController.js'; // Adjust the path as needed


const router = express.Router();

router.post('/', handleStripeWebhook);

export default router;
