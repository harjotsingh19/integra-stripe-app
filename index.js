import express from 'express';
import cors from 'cors';
import customerRoutes from './modules/customer/customerRoutes.js';
import paymentRoutes from './modules/payment/paymentRoutes.js';
import { connectToDatabase } from './core/connection.js'; // Import the connection function
import updateRoutes from './modules/swithcboardUpdate/updateRoute.js';
import authRoutes from './modules/auth/routes.js';
import auth from './middleware/auth.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user', customerRoutes);
app.use('/payment', paymentRoutes);
app.use('/version',updateRoutes)
app.use('/auth',authRoutes)

const startServer = async () => {
  await connectToDatabase(); // Connect to MongoDB

  app.listen(7000, () => {
    console.log('Server running on port 7000');
  });
};

startServer(); // Start the server
