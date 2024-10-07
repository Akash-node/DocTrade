import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`MongoDB Connected !! DB Host : ${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("MongoDB Connection failed: ", error)
  }
};

export default connectdb; 
