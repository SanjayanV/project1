import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    const farmer = req.user.id;

    const newProduct = await Product.create({ farmer, name, description, price, stock, category, image });
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
