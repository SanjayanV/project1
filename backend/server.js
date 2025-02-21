import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import connectDB from "./db/connectDB.js";
import cors from "cors";



const PORT = process.env.PORT || 5000;

const app = express();
 
dotenv.config();
app.get('/',(req,res)=>{res.send("Hello")});
dotenv.config();


app.use(express.urlencoded({ extended: true })); // Allow form data

app.use(cors())
app.use(express.json());
app.use("/api/users", userRoutes);


app.listen(PORT,()=>{console.log(`Server started at http://localhost:${PORT}`)});
connectDB();