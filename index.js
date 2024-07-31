import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Import body-parser for raw payload
import customerRoutes from './modules/customer/customerRoutes.js';
import paymentRoutes from './modules/payment/paymentRoutes.js';
import { connectToDatabase } from './core/connection.js'; // Import the connection function
// import updateRoutes from './modules/switchboardUpdate/updateRoute.js';
import authRoutes from './modules/auth/routes.js';
import productRoutes from './modules/product/productRoutes.js';
import auth from './middleware/auth.js';
import webhookRoutes from './modules/webhook/webhookRoute.js';
import { seedSubscriptionPlans } from './modules/product/productController.js';

const app = express();


app.use(
  '/webhook', 
  bodyParser.raw({ type: 'application/json' }), // Parse body as raw for /webhook
  webhookRoutes // Add your webhook route here
);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS

app.use('/user', customerRoutes);
app.use('/payment', paymentRoutes);
// app.use('/version', updateRoutes);
app.use('/auth', authRoutes);
app.use('/product', productRoutes);

// Webhook route with raw body parser for Stripe
// app.use('/webhook', webhookRoutes);

// Uncomment if needed for initial data seeding
// seedSubscriptionPlans();

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

const startServer = async () => {
  try {
    await connectToDatabase(); // Connect to MongoDB
    app.listen(7002, () => {
      console.log('Server running on port 7002');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer(); // Start the server
