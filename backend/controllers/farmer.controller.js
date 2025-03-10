import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// Get farmer's total earnings
export const getEarnings = async (req, res) => {
  try {
    const farmerId = req.user._id; // From JWT middleware
    const products = await Product.find({ farmer: farmerId });
    const productIds = products.map((p) => p._id);
    const orders = await Order.find({ "products.product": { $in: productIds }, status: "Completed" });
    const earnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get market prices (using farmer's product prices as a placeholder)
export const getMarketPrices = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const products = await Product.find({ farmer: farmerId });
    const prices = products.reduce((acc, product) => {
      acc[product.name] = product.price;
      return acc;
    }, {});
    res.json(prices);
  } catch (error) {
    console.error("Error fetching market prices:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get farmer's products
export const getProducts = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const products = await Product.find({ farmer: farmerId });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get orders data for chart
export const getOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const products = await Product.find({ farmer: farmerId });
    const productIds = products.map((p) => p._id);
    const orders = await Order.find({ "products.product": { $in: productIds }, status: "Completed" });

    // Aggregate orders by month (last 7 months)
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const values = Array(7).fill(0);
    const now = new Date();
    orders.forEach((order) => {
      const monthIndex = (12 + order.createdAt.getMonth() - now.getMonth()) % 12;
      if (monthIndex < 7) values[6 - monthIndex] += 1; // Count orders per month
    });

    res.json({ labels, values });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get analytics data for chart
export const getAnalytics = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const products = await Product.find({ farmer: farmerId });
    const productIds = products.map((p) => p._id);
    const orders = await Order.find({ "products.product": { $in: productIds }, status: "Completed" });

    const labels = products.map((p) => p.name);
    const values = products.map((product) => {
      return orders.reduce((sum, order) => {
        const orderProduct = order.products.find((p) => p.product.toString() === product._id.toString());
        return sum + (orderProduct ? orderProduct.quantity : 0);
      }, 0);
    });

    res.json({ labels, values });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get crop recommendation (dummy logic)
export const getCropRecommendation = async (req, res) => {
  try {
    const crops = ["Tomatoes", "Carrots", "Potatoes", "Onions", "Cucumbers"];
    const recommendation = crops[Math.floor(Math.random() * crops.length)];
    res.json({ recommendation });
  } catch (error) {
    console.error("Error fetching crop recommendation:", error);
    res.status(500).json({ error: "Server error" });
  }
};