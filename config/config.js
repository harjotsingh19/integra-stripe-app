import dotenv from 'dotenv';

dotenv.config();

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const MONGO_URI = process.env.MONGO_URI;
export const CustomerId = process.env.CustomerId;
export const Blockchain_url = process.env.BLOCKCHAIN_URL;
export const AUCTORITAS_USERNAME = process.env.AUCTORITAS_USERNAME;
export const AUCTORITAS_PASSWORD = process.env.AUCTORITAS_PASSWORD;
export const SWITCHBOARD_FRONT_END_VERSION = process.env.SWITCHBOARD_FRONT_END_VERSION;
export const SWITCHBOARD_BACK_END_VERSION = process.env.SWITCHBOARD_BACK_END_VERSION;
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;
export const TOKEN_PRICE=process.env.TOKEN_PRICE
export const STRIPE_WEBHOOK_SECRET=process.env.STRIPE_WEBHOOK_SECRET