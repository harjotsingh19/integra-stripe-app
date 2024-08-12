import express from 'express';
import {
  paymentSession,
  verifyPayment,
  
} from './paymentController.js';


import Validator from "./validator.js";
const paymentValidator = new Validator();
const router = express.Router();

router.post('/checkout',paymentValidator.validateUserEmail(),paymentValidator.result, paymentSession)

router.get('/verify', verifyPayment)


export default router;
