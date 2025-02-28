import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import connectDB from "./db/connectDB.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import productRoute from './routes/productRoute.js'; 


const app = express();

const PORT = process.env.PORT;

dotenv.config();

app.get('/',(req,res)=>{res.send("Hello")});
dotenv.config();
app.use(cookieParser()); 

app.use(express.urlencoded({ extended: true })); // Allow form data
  
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/products",productRoute);


app.listen(PORT,()=>{console.log(`Server started at http://localhost:${PORT}`)});
connectDB();


