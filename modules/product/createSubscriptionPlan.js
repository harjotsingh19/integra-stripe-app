import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';  
import { stripeSecretKey } from '../../config/config.js';  
import SubscriptionPlan from '../../models/subscriptionPlans.js'; 
import { connectToDatabase } from '../../core/connection.js'; 

await connectToDatabase();


const stripe = new Stripe(stripeSecretKey);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createProductandPrice = async () => {
  try {
    console.log('Reading plans...');
    let plans;

  
    if (process.argv.length > 2) {
    
      const data = process.argv[2];
      plans = JSON.parse(data);
    } else {

      const filePath = path.join(__dirname, '../../subscription-plans.json');
      console.log('Reading file from path:', filePath);
      const fileData = fs.readFileSync(filePath, 'utf-8');
      plans = JSON.parse(fileData);
    }

    console.log('Plans:', plans);

    for (const { name, description, period, amount, numberOfTokens } of plans) {
      console.log('Processing plan:', { name, description, period, amount, numberOfTokens });

      if (!name || typeof name !== 'string' || name.trim().length < 3) {
        console.log('Invalid name:', name);
        continue; 
      }

      if (!description || typeof description !== 'string' || description.trim().length < 10) {
        console.log('Invalid description:', description);
        continue; 
      }

      if (!['month', 'year'].includes(period)) {
        console.log('Invalid period:', period);
        continue;
      }

      if (isNaN(amount) || amount <= 0) {
        console.log('Invalid amount:', amount);
        continue; 
      }

      if (isNaN(numberOfTokens) || numberOfTokens <= 0) {
        console.log('Invalid numberOfTokens:', numberOfTokens);
        continue; 
      }

      console.log('Creating product...');
      const product = await stripe.products.create({
        name: name,
        description: description
      });

      if (!product) {
        console.log('Failed to create product:', product);
        continue; 
      }

      console.log('Product created:', product);

      console.log('Creating price...');
      const price = await stripe.prices.create({
        unit_amount: amount * 100, 
        currency: 'usd',
        recurring: {
          interval: period,
        },
        product: product.id,
      });

      if (!price) {
        console.log('Failed to create price:', price);
        continue; 
      }

      console.log('Price created:', price);

      console.log('Saving to database...');
      await SubscriptionPlan.create({
        productId: product.id,
        priceId: price.id,
        name,
        description,
        amount,
        period,
        numberOfTokens 
      });

      console.log('Saved to database');
    }

    console.log('All products and prices created successfully');
  } catch (err) {
    console.error('Error:', err);
  }
};


createProductandPrice();
