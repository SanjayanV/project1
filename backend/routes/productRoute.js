import express from "express";
import { addProduct, getProducts } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addProduct);
router.get("/", getProducts);

export default router;
