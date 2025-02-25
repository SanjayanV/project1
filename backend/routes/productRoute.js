import express from "express";
import { addProduct, getProducts,deleteProduct } from "../controllers/product.controller.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/", getProducts);

export default router;
