// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Optional if auth is removed
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;