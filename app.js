// import express from 'express';
// import cors from 'cors';
// import customerRoutes from './modules/customer/customerRoutes.js';
// import paymentRoutes from './modules/payment/paymentRoutes.js';
// import { connectToDatabase } from './core/connection.js'; // Import the connection function

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use('/user', customerRoutes);
// app.use('/payment', paymentRoutes);

// const startServer = async () => {
//   await connectToDatabase(); // Connect to MongoDB

//   app.listen(5000, () => {
//     console.log('Server running on port 5000');
//   });
// };

// startServer(); // Start the server
