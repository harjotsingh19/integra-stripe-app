import express from 'express';
// import { registerUser } from './customerController.js';
import Validator from "./validator.js";
import { registerUser,retrieveCustomer } from './customerController.js';
const userValidator = new Validator();

const router = express.Router();


router.get('/',retrieveCustomer)
router.get('/register',registerUser);

export default router;
