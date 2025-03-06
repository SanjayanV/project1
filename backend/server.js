import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import connectDB from "./db/connectDB.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import productRoute from './routes/productRoute.js'; 
import authRoutes from './routes/authRoutes.js';

const app = express();

const PORT = process.env.PORT;

dotenv.config();

app.get('/',(req,res)=>{res.send("Hello")});
dotenv.config();
app.use(cookieParser()); 

app.use(express.urlencoded({ extended: true })); // Allow form data
  
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/products",productRoute);
app.use("/api/auth",authRoutes)


app.listen(PORT,()=>{console.log(`Server started at http://localhost:${PORT}`)});
connectDB();


