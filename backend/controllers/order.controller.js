import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const consumer = req.user.id;

    const newOrder = await Order.create({ consumer, products, totalAmount });
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user.id }).populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
