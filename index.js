import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import paymentRoutes from './modules/payment/paymentRoutes.js';
import { connectToDatabase } from './core/connection.js'; 
import productRoutes from './modules/product/productRoutes.js';
import webhookRoutes from './modules/webhook/webhookRoute.js';


const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With', 
    'Accept',
    'X-Custom-Header' 
  ],
  exposedHeaders: ['Content-Length'], 
  credentials: true 
}));


app.use(
  '/webhook', 
  bodyParser.raw({ type: 'application/json' }), 
  webhookRoutes 
);

app.use(express.json());
// app.use(cors()); 

app.use('/payment', paymentRoutes);
app.use('/product', productRoutes);


const startServer = async () => {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer(); 
