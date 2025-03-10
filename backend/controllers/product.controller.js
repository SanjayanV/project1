import Product from "../models/product.model.js";
import Bill from "../models/bill.model.js";
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image, products } = req.body;
    const farmer = req.user.id;

    // If products array is provided, save it as a bill
    if (products && Array.isArray(products)) {
      const newBill = new Bill({
        farmerId: farmer,
        products,
        createdAt: new Date(),
      });

      await newBill.save();
      return res.status(201).json({ message: "Bill added successfully", bill: newBill });
    }

    // Otherwise, add a single product
    const newProduct = await Product.create({ farmer, name, description, price, stock, category, image });
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const farmerId = req.user.uid; // Firebase UID from token
    const snapshot = await db.ref(`products/${farmerId}`).once("value");
    const products = snapshot.val() || {};
    const productList = Object.keys(products).map((key) => ({
      id: key,
      ...products[key],
    }));
    res.json(productList);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
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


export const saveProduct = async (req, res) => {
  try {
    const farmerId = req.user.uid;
    const { name, price, stock, image } = req.body;
    const newProductRef = db.ref(`products/${farmerId}`).push();
    await newProductRef.set({ name, price, stock, image });
    res.status(201).json({ message: "Product added", id: newProductRef.key });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Server error" });
  }
};