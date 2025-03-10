import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farmerName, setFarmerName] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("Please log in.");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        console.log("Fetching from:", `${API_BASE_URL}/api/farmer/products`);
        const response = await fetch(`${API_BASE_URL}/api/farmer/products`, { headers });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
        }
        const productsData = await response.json();
        console.log("Products data:", productsData);
        setProducts(productsData);
        setFarmerName(user.displayName || "Farmer");
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
  const cardHover = { scale: 1.03, transition: { duration: 0.3 } };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <motion.div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`} variants={pageVariants} initial="initial" animate="animate">
      <div className="flex justify-between items-center mb-8">
        <motion.div className="bg-white p-6 rounded-lg flex items-center gap-4">
          <img src="https://via.placeholder.com/50" alt="Farmer Logo" className="w-14 h-14 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-green-700">Hello, {farmerName}!</h2>
            <motion.button className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded-lg" onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.05 }}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg your-products`} whileHover={cardHover}>
          <h3 className="font-semibold text-xl text-teal-600">Your Products</h3>
          {products.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No products available. <Link to="/addproducts" className="text-teal-600">Add a product</Link>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-3">
              {products.map((product) => (
                <motion.div key={product.id} whileHover={{ scale: 1.05 }} className="text-center p-2 rounded-lg bg-teal-50">
                  <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="w-16 h-16 object-cover rounded-lg mx-auto" />
                  <p className="text-sm font-medium mt-2">{product.name}</p>
                  <p className="text-xs text-gray-600">₹{product.price}/kg</p>
                  <p className="text-xs text-gray-500">{product.stock} kg available</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <Link to="/addproducts" className="w-full">
          <motion.button className="w-full py-3 bg-green-600 text-white rounded-lg" whileHover={{ scale: 1.05 }}>
            Add Product
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Dashboard;