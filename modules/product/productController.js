
import Stripe from 'stripe';  
import { stripeSecretKey } from '../../config/config.js';  
import SubscriptionPlan from '../../models/subscriptionPlans.js'; 
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";



const stripe = new Stripe(stripeSecretKey);  


export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    
    if (!plans.length) {
      return response.HttpResponse(
        res,
        statusCode.ok,
        responseStatus.success,
        messages.plansNotFound,
        {},
      );
    }
    console.log("plans found");
    
    return response.HttpResponse(
      res,
      statusCode.ok,
      responseStatus.success,
      messages.plansFound,
      {subscriptionPlans:plans},
    );
 
  } catch (err) {
    console.error('Error fetching plans:', err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      messages.err,
      {},
    );
}
}

export const createProductandPrice = async (req, res) => {

  try {
    const { name, description, period, amount } = req.body;


    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ message: 'Invalid name: should be a non-empty string of at least 3 characters' });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ message: 'Invalid description: should be a non-empty string of at least 10 characters' });
    }

    if (!['month', 'year'].includes(period)) {
      return res.status(400).json({ message: 'Invalid period: should be either "month" or "year"' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount: should be a positive number' });
    }


    // Create the product
    const product = await stripe.products.create({
      name: name,
      description: description
    });
    console.log("🚀 ~ createProduct ~ product:", product)
    if (!product) {
      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        "failed to create product",
        {}
      );
    }


    // Create the price for the product
    const Price = await stripe.prices.create({
      unit_amount: amount * 100, // Amount in cents
      currency: 'usd',
      recurring: {
        interval: period,
      },
      product: product.id,
    });
    if (!Price) {
      return response.HttpResponse(
        res,
        statusCode.errorPage,
        responseStatus.failure,
        "failed to create price",
        {}
      );
    }

    return response.HttpResponse(
      res,
      statusCode.created,
      responseStatus.success,
      "product and its price created",
      { product: product, price: Price }
    );
  }
  catch (err) {
    console.error(err);
    return response.HttpResponse(
      res,
      statusCode.serverError,
      responseStatus.failure,
      err.message,
      {}
    )
  }
};

