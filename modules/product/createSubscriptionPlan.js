import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';  // Correctly import Stripe
import { stripeSecretKey } from '../../config/config.js';  // Import named export
import SubsciptionPlan from '../../models/subscriptionPlans.js'; // Make sure to define your Product model
import { connectToDatabase } from '../../core/connection.js'; // Import the connection function


await connectToDatabase();


// Initialize Stripe with the named export
const stripe = new Stripe(stripeSecretKey);


// Convert __dirname to use with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create products and prices
const createProductandPrice = async () => {
    try {
      console.log('Reading plans...');
      let plans;
  
      // Check if there are data in command line arguments
      if (process.argv.length > 2) {
        // Use data from command line arguments if provided
        const data = process.argv[2];
        plans = JSON.parse(data);
      } else {
        // Read data from file if no command line arguments are provided
        const filePath = path.join(__dirname, '../../subscription-plans.json'); // Adjust path as needed
        console.log('Reading file from path:', filePath);
        const fileData = fs.readFileSync(filePath, 'utf-8');
        plans = JSON.parse(fileData);
      }
  
      console.log('Plans:', plans);
  
      for (const { name, description, period, amount } of plans) {
        console.log('Processing plan:', { name, description, period, amount });
  
        if (!name || typeof name !== 'string' || name.trim().length < 3) {
          console.log('Invalid name:', name);
          continue; // Skip this plan
        }
  
        if (!description || typeof description !== 'string' || description.trim().length < 10) {
          console.log('Invalid description:', description);
          continue; // Skip this plan
        }
  
        if (!['month', 'year'].includes(period)) {
          console.log('Invalid period:', period);
          continue; // Skip this plan
        }
  
        if (isNaN(amount) || amount <= 0) {
          console.log('Invalid amount:', amount);
          continue; // Skip this plan
        }
  
        console.log('Creating product...');
        const product = await stripe.products.create({
          name: name,
          description: description
        });
  
        if (!product) {
          console.log('Failed to create product:', product);
          continue; // Skip to the next plan
        }
  
        console.log('Product created:', product);
  
        console.log('Creating price...');
        const price = await stripe.prices.create({
          unit_amount: amount * 100, // Amount in cents
          currency: 'usd',
          recurring: {
            interval: period,
          },
          product: product.id,
        });
  
        if (!price) {
          console.log('Failed to create price:', price);
          continue; // Skip to the next plan
        }
  
        console.log('Price created:', price);
  
        console.log('Saving to database...');
        await SubsciptionPlan.create({
          productId: product.id,
          priceId: price.id,
          name,
          description,
          amount,
          period
        });
  
        console.log('Saved to database');
      }
  
      console.log('All products and prices created successfully');
    } catch (err) {
      console.error('Error:', err);
    }
  };

// Execute the function
createProductandPrice();
