import express from "express";
import { addProduct, getProducts,deleteProduct } from "../controllers/product.controller.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {verifyToken} from "../middlewares/auth.js"



const router = express.Router();

router.post("/add", authMiddleware, addProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/", getProducts);

router.post("/save-products", verifyToken, async (req, res) => {
    try {
      const { products } = req.body; // Array of selected products
      const farmerId = req.user.id; // Farmer's ID from the token
  
      // Save products to the database
      const savedProducts = await Product.insertMany(
        products.map((product) => ({ ...product, farmer: farmerId }))
      );
  
      res.status(201).json({ message: "Products saved successfully", products: savedProducts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });



export default router;
