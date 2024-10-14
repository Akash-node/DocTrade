//require('dotenv').config( path: './.env');
import dotenv from "dotenv"
import connectdb from "./db/connectDb.js";
import { app } from "./app.js";
dotenv.config({
    path: './.env'
})

connectdb()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`🗄️  Server is running on Port: ${process.env.PORT}`);
    })
})
.catch((err) => {
   console.log("MongoDB Connection Failed" , err)
})

app.get("/demo", (req,res) =>{
    res.json({
        message: "Hey there API is working"
    })
})