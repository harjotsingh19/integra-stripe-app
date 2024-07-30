import express from 'express';
import {
  attachPaymentMethod,
  listPaymentMethods,
  createPaymentIntent,
  paymentSession,
  retreivePayment,
  getTokenPrice,
  confirmPayment,
  verifyPayment,
  
} from './paymentController.js';


import Validator from "./validator.js";
const paymentValidator = new Validator();
const router = express.Router();

router.get('/method/attach', attachPaymentMethod);
router.get('/method', listPaymentMethods);
router.get('/create', createPaymentIntent);
router.get('/confirm', confirmPayment);
router.get('/',retreivePayment);
router.get('/tokenPrice',getTokenPrice)



router.get('/checkout',paymentValidator.validateUserEmail(),paymentValidator.result, paymentSession)


// router.get('/complete', async (req, res) => {
//   const result = Promise.all([
//       stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
//       stripe.checkout.sessions.listLineItems(req.query.session_id)
//   ])

//   console.log(JSON.stringify(await result))

//   res.send('Your payment was successful')
// })

router.get('/cancel', (req, res) => {
  res.redirect(`${process.env.FRONT_END_BASE_URL}/`);
})


router.get('/verify', verifyPayment)


export default router;
