
import Stripe from 'stripe';  // Correctly import Stripe
import { stripeSecretKey } from '../../config/config.js';  // Import named export
import SubscriptionPlan from '../../models/subscriptionPlans.js'; // Make sure to define your Product model
import response from "../../responseHandler/response.js";
import { messages, responseStatus, statusCode } from "../../core/constants/constant.js";



const stripe = new Stripe(stripeSecretKey);  // Initialize Stripe with the named export


export const getSubscriptionPlans = async (req, res) => {
  try {
    // const plans = await SubscriptionPlan.find({}, 'name period amount description');
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

// export const createPrice = async (req, res) => {

//   try {
//     const { name, description} = req.body;
//       // Create the product


//       const monthlyPrice = await stripe.prices.create({
//         unit_amount: 1000, // Amount in cents, i.e., $10.00
//         currency: 'usd',
//         recurring: {
//           interval: 'month', // Billing interval: every month
//         },
//         product: 'prod_XXXXXXX', // Product ID
//       });

//       if (!price) {
//         return response.HttpResponse(
//           res,
//           statusCode.errorPage,
//           responseStatus.failure,
//           "failed to create price",
//           {}
//         );
//       }

//       return response.HttpResponse(
//         res,
//         statusCode.created,
//         responseStatus.success,
//         "product and its price created",
//         { product: product, price: price }
//       );
//     }
//     catch (err) {
//       console.error(err);
//       return response.HttpResponse(
//         res,
//         statusCode.serverError,
//         responseStatus.failure,
//         err.message,
//         {}
//       )
//     }
//   };


// export const createSubscription = async (req, res) => {
//   try {
//     const { customerId, priceId, emailId, paymentMethodId } = req.body;

//     // Simple validation
//     if (!priceId || typeof priceId !== 'string') {
//       return response.HttpResponse(
//         res,
//         statusCode.badRequest,
//         responseStatus.failure,
//         messages.priceIdNotFound,
//         {}
//       );
//     }

//     let finalCustomerId = customerId;

//     // If no customerId is provided, create a new customer
//     if (!customerId) {
//       if (!emailId) {
//         return response.HttpResponse(
//           res,
//           statusCode.badRequest,
//           responseStatus.failure,
//           messages.emailRequired,
//           {}
//         );
//       }

//       const customer = await stripe.customers.create({
//         email: emailId,
//       });
//       if (!customer) {
//         return response.HttpResponse(
//           res,
//           statusCode.forbidden,
//           responseStatus.failure,
//           messages.customernotCreated,
//           {}
//         );
//       }

//       finalCustomerId = customer.id; // Use the newly created customer ID
//       console.log("🚀 ~ createSubscription ~ customerId:", finalCustomerId);
//     }

//     // Attach payment method to the customer
//     if (paymentMethodId) {
//       await stripe.paymentMethods.attach(paymentMethodId, { customer: finalCustomerId });
//       // Set it as the default payment method
//       await stripe.customers.update(finalCustomerId, {
//         invoice_settings: {
//           default_payment_method: paymentMethodId,
//         },
//       });
//     } else {
//       return response.HttpResponse(
//         res,
//         statusCode.badRequest,
//         responseStatus.failure,
//         messages.paymentMethodRequired,
//         {}
//       );
//     }

//     // Create the subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: finalCustomerId,
//       items: [{ price: priceId }],
//       expand: ['latest_invoice.payment_intent'],
//     });

//     return response.HttpResponse(
//       res,
//       statusCode.created,
//       responseStatus.success,
//       messages.subscriptionCreated,
//       { subscription: subscription }
//     );
//   } catch (err) {
//     console.error(err);
//     return response.HttpResponse(
//       res,
//       statusCode.serverError,
//       responseStatus.failure,
//       messages.err,
//       {}
//     );
//   }
// };





// const plans = [
//   { name: "Personal", description: "Access to Personal Plan of 174 tokens with monthly and annual billing options", amount: 25, period: "month" },
//   { name: "Personal", description: "Access to Personal Plan of 174 tokens with monthly and annual billing options", amount: 15, period: "year" },
//   { name: "Standard", description: "Access to Standard Plan of 600 tokens with monthly and annual billing options", amount: 60, period: "month" },
//   { name: "Standard", description: "Access to Standard Plan of 600 tokens with monthly and annual billing options", amount: 40, period: "year" },
//   { name: "Pro", description: "Access to Pro Plan of 1500 tokens with monthly and annual billing options", amount: 100, period: "month" },
//   { name: "Pro", description: "Access to Pro Plan of 1500 tokens with monthly and annual billing options", amount: 75, period: "year" },
//   { name: "Enterprise", description: "Access to Enterprise Plan with custom billing options", amount: 0, period: "month" } // Custom pricing
// ];


// export const seedSubscriptionPlans = async () => {
//   try {
//     // Check existing products in the database
//     const existingProducts = await SubsciptionPlan.find({});
//     const existingProductMap = new Map(existingProducts.map(p => [p.productId, p]));

//     for (const plan of plans) {
//       // Check if the product already exists in Stripe
//       const stripeProducts = await stripe.products.list({ limit: 100 });
//       const stripeProduct = stripeProducts.data.find(p => p.name === plan.name && p.description === plan.description);

//       let productId = null;
//       if (stripeProduct) {
//         productId = stripeProduct.id;
//       } else {
//         // Create the product in Stripe
//         const product = await stripe.products.create({
//           name: plan.name,
//           description: plan.description
//         });
//         productId = product.id;
//       }

//       // Check if the price already exists in Stripe
//       const stripePrices = await stripe.prices.list({ limit: 100 });
//       const stripePrice = stripePrices.data.find(p => p.product === productId && p.unit_amount === plan.amount * 100 && p.recurring.interval === plan.period);

//       if (!stripePrice) {
//         // Create the price in Stripe
//         await stripe.prices.create({
//           unit_amount: plan.amount * 100,
//           currency: 'usd',
//           recurring: {
//             interval: plan.period,
//           },
//           product: productId,
//         });
//       }

//       // Check if the plan already exists in the database
//       if (!existingProductMap.has(productId)) {
//         // Store product and price in the database
//         await SubsciptionPlan.create({
//           productId: productId,
//           priceId: stripePrice ? stripePrice.id : null, // Update accordingly if you have price ID
//           name: plan.name,
//           description: plan.description,
//           amount: plan.amount,
//           period: plan.period
//         });
//       }
//     }

//     console.log('All plans have been checked and created if necessary.');
//   } catch (err) {
//     console.error('Error seeding plans:', err);
//   }
// };



const plans = [
  { name: "Personal", description: "Access to Personal Plan of 174 tokens with monthly billing", amount: 25, period: "month" },
  { name: "Personal", description: "Access to Personal Plan of 174 tokens with annual billing", amount: 15, period: "year" },
  { name: "Standard", description: "Access to Standard Plan of 600 tokens with monthly billing", amount: 60, period: "month" },
  { name: "Standard", description: "Access to Standard Plan of 600 tokens with annual billing", amount: 40, period: "year" },
  { name: "Pro", description: "Access to Pro Plan of 1500 tokens with monthly billing", amount: 100, period: "month" },
  { name: "Pro", description: "Access to Pro Plan of 1500 tokens with annual billing", amount: 75, period: "year" },
  { name: "Enterprise", description: "Access to Enterprise Plan with custom billing", amount: 0, period: "month" } // Custom pricing
];

export const seedSubscriptionPlans = async () => {
  try {
    // Step 1: Retrieve existing plans from the database
    const existingPlans = await SubsciptionPlan.find({});

    // Step 2: Create a map for easy lookup
    const existingPlansMap = new Map(existingPlans.map(p => [p.productId, p]));

    // Step 3: Process each plan
    for (const plan of plans) {
      // Find the corresponding existing plan, if any
      const existingPlan = existingPlansMap.get(plan.productId);

      // Check if there is a change in the plan data
      const isNewPlan = !existingPlan;
      const isChangedPlan = existingPlan && (
        existingPlan.name !== plan.name ||
        existingPlan.description !== plan.description ||
        existingPlan.amount !== plan.amount ||
        existingPlan.period !== plan.period
      );

      if (isNewPlan || isChangedPlan) {
        // Create or update product and price in Stripe
        let stripeProductId = existingPlan ? existingPlan.productId : null;
        let stripePriceId = existingPlan ? existingPlan.priceId : null;

        if (isNewPlan || isChangedPlan) {
          if (!stripeProductId) {
            // Create product in Stripe
            const stripeProduct = await stripe.products.create({
              name: plan.name,
              description: plan.description
            });
            stripeProductId = stripeProduct.id;
          }

          // Create or update price in Stripe
          let stripePrice = await stripe.prices.list({
            product: stripeProductId,
            limit: 100
          }).then(response => response.data.find(p => p.unit_amount === plan.amount * 100 && p.recurring.interval === plan.period));

          if (!stripePrice) {
            // Create the price in Stripe
            const newPrice = await stripe.prices.create({
              unit_amount: plan.amount * 100,
              currency: 'usd',
              recurring: {
                interval: plan.period,
              },
              product: stripeProductId,
            });
            stripePriceId = newPrice.id;
          } else {
            stripePriceId = stripePrice.id;
          }

          // Update or create the plan in the database
          await SubsciptionPlan.updateOne(
            { productId: stripeProductId },
            {
              $set: {
                productId: stripeProductId,
                priceId: stripePriceId,
                name: plan.name,
                description: plan.description,
                amount: plan.amount,
                period: plan.period
              }
            },
            { upsert: true } // Create if it does not exist
          );
        }
      }
    }

    console.log('All subscription plans have been checked, updated, or created as necessary.');
  } catch (err) {
    console.error('Error seeding plans:', err);
  }
};