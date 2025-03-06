import express from "express";
import { addProduct, getProducts, deleteProduct, saveProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/addprod", authMiddleware, addProduct);
router.delete("/remproduct/:id", authMiddleware, deleteProduct);
router.get("/", getProducts);
router.post("/save-products", verifyToken, saveProduct);

export default router;