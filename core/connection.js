import mongoose from "mongoose";
import { MONGO_URI,FRONT_END_BASE_URL } from "../config/config.js";
const connectToDatabase = async () => {
    try {
        console.log("FRONT_END_BASE_URL is :- ",FRONT_END_BASE_URL)
        await mongoose.connect(MONGO_URI);
        console.log('Connected To Database');
    } catch (e) {
        console.log("mongo url iss :- ",MONGO_URI)
        console.log(`Error While Trying To Connect To Databasee ${e}`);
    }
}
export {
    connectToDatabase
}