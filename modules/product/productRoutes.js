import express from 'express';
import {

  createProductandPrice,
  getSubscriptionPlans
  
} from './productController.js';
;
const router = express.Router();


router.post('/', createProductandPrice)
router.get('/subscription/plans', getSubscriptionPlans)




export default router;
