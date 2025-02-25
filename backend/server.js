import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import connectDB from "./db/connectDB.js";
import cors from "cors";
import cookieParser from 'cookie-parser';



const app = express();

const PORT = process.env.PORT;

dotenv.config();

app.get('/',(req,res)=>{res.send("Hello")});
dotenv.config();
app.use(cookieParser()); 

app.use(express.urlencoded({ extended: true })); // Allow form data

app.use(cors())
app.use(express.json());

//endpoints
app.use("/api", userRoutes);


app.listen(PORT,()=>{console.log(`Server started at http://localhost:${PORT}`)});
connectDB();
console.log(process.env)