import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";
const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected To Database');
    } catch (e) {
        console.log(`Error While Trying To Connect To Database ${e}`);
    }
}
export {
    connectToDatabase
}