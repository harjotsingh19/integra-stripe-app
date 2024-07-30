import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { encryptPassword } from "../helper/passwordManager.js";
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ isAdmin: true });

        if (!existingAdmin) {
            // Create admin credentials
            const adminCredentials = {
                emailId: "admin@yopmail.com",
                password: "adminpw",
                isAdmin: true,
                // Add other fields as needed
            };

            // Hash the admin password
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

            const hashedPassword = await encryptPassword(adminCredentials.password)
            adminCredentials.password = hashedPassword;

            // Create admin user
            await userModel.create(adminCredentials);

            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }

        console.log('Connected To Database');
    } catch (e) {
        console.log(`Error While Trying To Connect To Database ${e}`);
    }
}
export {
    connectToDatabase
}