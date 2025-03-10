import express from "express";
import { addProduct, getProducts, deleteProduct, saveProduct } from "../controllers/product.controller.js";
import { protect,authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";


const router = express.Router();

router.post("/products", protect, getProducts);
router.delete("/remproduct/:id", protect, deleteProduct);
router.post("/save-products",authMiddleware, saveProduct);

export default router;