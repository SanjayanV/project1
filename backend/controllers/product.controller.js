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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.id;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.farmer.toString() !== farmerId) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};