import express from 'express';
import cors from 'cors';
import customerRoutes from './modules/customer/customerRoutes.js';
import paymentRoutes from './modules/payment/paymentRoutes.js';
import { connectToDatabase } from './core/connection.js'; // Import the connection function
import updateRoutes from './modules/swithcboardUpdate/updateRoute.js';
import authRoutes from './modules/auth/routes.js';
import productRoutes from './modules/product/productRoutes.js';
import auth from './middleware/auth.js';
import webhookRoutes from './modules/webhook/webhookRoute.js';
  import {seedSubscriptionPlans} from './modules/product/productController.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', customerRoutes);
app.use('/payment', paymentRoutes);
app.use('/version',updateRoutes)
app.use('/auth',authRoutes)
app.use('/product',productRoutes)
app.use('/webhook', webhookRoutes);

// seedSubscriptionPlans();


const startServer = async () => {
  await connectToDatabase(); // Connect to MongoDB

  app.listen(7000, () => {
    console.log('Server running on port 7000');
  });
};

startServer(); // Start the server
