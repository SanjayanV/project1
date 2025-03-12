import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, User, Settings, LogOut } from "lucide-react";
import { auth } from "../firebase.js"; // Firebase Auth
import { getDatabase, ref, push, set } from "firebase/database"; // Firebase Realtime Database

// Product Data with Categories
const products = [
  { id: 1, name: "Fresh Carrots", tamilName: "கேரட்", weight: "1kg", category: "Vegetables", image: "https://www.bigbasket.com/media/uploads/p/xxl/10000070_16-fresho-carrot-orange.jpg" },
  { id: 2, name: "Organic Tomatoes", tamilName: "தக்காளி", category: "Vegetables", weight: "1kg", image: "https://img.freepik.com/free-photo/top-view-fresh-red-tomatoes-inside-basket_140725-57742.jpg" },
  { id: 3, name: "Green Apples", tamilName: "பச்சை ஆப்பிள்கள்", category: "Fruits", weight: "1kg", image: "https://st3.depositphotos.com/30407070/36782/i/450/depositphotos_367825706-stock-photo-green-apples-plate-brown-wooden.jpg" },
  { id: 4, name: "Bananas", weight: "1kg", tamilName: "வாழைப்பழம்", category: "Fruits", image: "https://thumbs.dreamstime.com/b/bunch-bananas-plate-great-creative-professional-projects-356584793.jpg" },
  { id: 5, name: "Almond Seeds", weight: "1kg", tamilName: "பாதாம் விதைகள்", category: "Seeds", image: "https://cbx-prod.b-cdn.net/COLOURBOX47480356.jpg?width=800&height=800&quality=70" },
];

const ProductSelection = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billList, setBillList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState({ name: "John Doe", email: "john@example.com" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const db = getDatabase(); // Firebase Realtime Database instance

  // Fetch farmer info on mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFarmerInfo({
        name: user.displayName || "Farmer",
        email: user.email || "No email",
      });
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Speech recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : "ta-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find((p) =>
        p.name.toLowerCase().includes(transcript) ||
        (language === "Tamil" && p.tamilName.toLowerCase().includes(transcript))
      );
      if (product) toggleSelection(product);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language]);

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const addToBill = () => {
    setBillList((prev) => {
      let updatedBill = [...prev];
      selectedProducts.forEach((product) => {
        const existingIndex = updatedBill.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          updatedBill[existingIndex].qty += 1;
          updatedBill[existingIndex].finalPrice = updatedBill[existingIndex].qty * (Number(updatedBill[existingIndex].customPrice) || 0);
        } else {
          updatedBill.push({ ...product, qty: 1, customPrice: "", finalPrice: 0 });
        }
      });
      return updatedBill;
    });
    setSelectedProducts([]);
  };

  const updateQuantity = (id, newQty) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, newQty), finalPrice: Math.max(1, newQty) * (Number(item.customPrice) || 0) }
          : item
      )
    );
  };

  const updateCustomPrice = (id, newPrice) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, customPrice: newPrice, finalPrice: item.qty * (Number(newPrice) || 0) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
  };
  
  

  const handleSaveProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to save products");
        navigate("/login");
        return;
      }

      const productsToSave = billList.map((item) => {
        const price = Number(item.customPrice);
        if (isNaN(price) || price <= 0) {
          throw new Error("All products must have a valid price greater than 0.");
        }
        return {
          name: item.name,
          quantity: item.qty,
          price,
          category: item.category,
          image: item.image,
          farmerId: user.uid,
          farmerName: farmerInfo.name,
          createdAt: new Date().toISOString(),
        };
      });

      // Save products to Firebase Realtime Database under the farmer's UID
      const productsRef = ref(db, `products`);
      for (const product of productsToSave) {
        const newProductRef = push(productsRef); // Generate a unique key for each product
        await set(newProductRef, product);
      }

      setBillList([]);
      alert("Products saved successfully!");
    } catch (err) {
      console.error("Error saving products:", err.message);
      setError(err.message || "Failed to save products.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    language === "English"
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : product.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedBill = {
    Vegetables: billList.filter((item) => item.category === "Vegetables"),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    "Dairy Products": billList.filter((item) => item.category === "Dairy Products"),
  };

  const totalAmount = billList.reduce((sum, item) => sum + Number(item.finalPrice), 0);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className={`min-h-screen p-6 font-mont ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-black"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.header className="flex justify-between items-center mb-8 bg-gradient-to-r from-[#76de5c] to-[#00ba4e] backdrop-blur-md p-4 rounded-2xl shadow-lg" variants={containerVariants}>
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-teal-200"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-2xl font-bold text-[#212121]">
            {language === "English" ? "Farmer's Market" : "விவசாய சந்தை"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-gradient-to-br from-[black] to-[#393939] rounded-full hover:bg-green-600" whileHover={{ scale: 1.1 }}>
            <Settings className="w-6 h-6 text-[#15a2a7]" />
          </motion.button>
          <motion.button className="p-2 bg-gradient-to-br from-[black] to-[#393939] rounded-full hover:bg-teal-200" whileHover={{ scale: 1.1 }}>
            <User className="w-6 h-6 text-green-600" />
          </motion.button>
          <motion.button onClick={()=>{navigate("/dashboard")}} className="p-2 bg-gradient-to-br from-[black] to-[#393939] rounded-full hover:bg-red-200" whileHover={{ scale: 1.1 }}>
              <LogOut className="w-6 h-6 text-red-800" />
          </motion.button>
        </div>
      </motion.header>

      {showSettings && (
        <motion.div className="absolute top-20 right-6 p-4 bg-white rounded-2xl shadow-xl z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-teal-800">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600">{farmerInfo.email}</p>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 rounded-lg border border-teal-200">
              <option value="English">English</option>
              <option value="Tamil">தமிழ்</option>
            </select>
            <button onClick={() => setDarkMode(!darkMode)} className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder={language === "English" ? "Search products..." : "தயாரிப்புகளைத் தேடு..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-teal-500 bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <motion.button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => toggleSelection(product)}
              className={`p-4 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                selectedProducts.some((p) => p.id === product.id) ? "border-teal-500" : "border-transparent"
              }`}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold text-teal-800">
                {language === "English" ? product.name : product.tamilName}
              </h3>
              <p className="text-sm text-gray-600">{product.weight}</p>
            </motion.div>
          ))}
        </motion.div>

        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="w-full max-w-xs mx-auto block p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === "English" ? "Add Products" : "பில் சேர்"}
          </motion.button>
        )}

        {billList.length > 0 && (
          <motion.div className="mt-8 p-6 bg-white/90 rounded-2xl shadow-lg" variants={containerVariants}>
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Your Bill" : "உங்கள் பில்"}
            </h2>
            {["Vegetables", "Fruits", "Seeds", "Dairy Products", "Herbs", "Fertilizers"].map((category) => (
              categorizedBill[category].length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-semibold text-teal-700">
                    {language === "English" ? category : {
                      Vegetables: "காய்கறிகள்",
                      Fruits: "பழங்கள்",
                      Seeds: "விதைகள்",
                      "Dairy Products": "பால் பொருட்கள்",
                      Fertilizers: "உரங்கள்",
                      Herbs: "மூலிகைகள்",
                    }[category]}
                  </h3>
                  {categorizedBill[category].map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-b border-teal-100"
                      variants={itemVariants}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                        <div>
                          <p className="font-medium text-teal-800">
                            {language === "English" ? item.name : item.tamilName}
                          </p>
                          <p className="text-sm text-gray-600">{item.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 p-2 rounded-lg border border-teal-200 text-center"
                          min="1"
                        />
                        <input
                          type="number"
                          placeholder="Set Price"
                          value={item.customPrice}
                          onChange={(e) => updateCustomPrice(item.id, e.target.value)}
                          className="w-20 p-2 rounded-lg border border-teal-200 text-center"
                          min="0"
                        />
                        <p className="text-teal-700 font-medium">₹{item.finalPrice}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-right font-semibold text-teal-800 mt-2">
                    {language === "English" ? "Subtotal" : "துணை மொத்தம்"}: ₹{categorizedBill[category].reduce((sum, item) => sum + Number(item.finalPrice), 0)}
                  </p>
                </div>
              )
            ))}
            <p className="text-2xl font-bold text-teal-800 text-right">
              {language === "English" ? "Total" : "மொத்தம்"}: ₹{totalAmount}
            </p>
            <motion.button
              onClick={handleSaveProducts}
              disabled={loading}
              className={`mt-4 w-full py-3 ${loading ? "bg-gray-400" : "bg-teal-600"} text-white rounded-lg hover:bg-teal-700 shadow-md`}
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading
                ? (language === "English" ? "Saving..." : "சேமிக்கிறது...")
                : (language === "English" ? "Save to Products" : "தயாரிப்புகளாக சேமி")
              }
            </motion.button>
            {error && (
              <motion.p
                className="text-red-600 mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;