//require('dotenv').config( path: './.env');
import dotenv from "dotenv"
import connectdb from "./db/connectDb.js";
dotenv.config({
    path: './.env'
})

connectdb();