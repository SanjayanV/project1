import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  // State declarations
  const [weather, setWeather] = useState(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fullScreenGraph, setFullScreenGraph] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Weather fetch effect
  useEffect(() => {
    const fetchWeather = async () => {
      if (country && city) {
        try {
          const apiKey = "350bfa82c3adbbcb64a94541981012fd";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`
          );
          if (!response.ok) throw new Error("Location not found");
          const data = await response.json();
          setWeather(data);
          setWeatherIcon(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        } catch (error) {
          console.error("Error fetching weather:", error);
          setWeather(null);
        }
      }
    };
    fetchWeather();
  }, [country, city]);

  // Currency conversion effect
  useEffect(() => {
    const convertCurrency = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      } catch (error) {
        console.error("Error converting currency:", error);
      }
    };
    if (amount && fromCurrency && toCurrency) convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  // Random data functions
  const randomEarnings = () => Math.floor(Math.random() * 100000);
  const randomPrices = () => ({
    Carrots: Math.floor(Math.random() * 200),
    Tomatoes: Math.floor(Math.random() * 300),
    Apples: Math.floor(Math.random() * 400),
  });
  const randomCropRecommendation = () => {
    const crops = ["Tomatoes", "Carrots", "Potatoes", "Onions", "Cucumbers"];
    return crops[Math.floor(Math.random() * crops.length)];
  };

  // Chart data (updated with green theme colors)
  const generateOrdersData = () => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Orders",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: "#2ECC7180", // Vibrant green with 50% opacity
      borderColor: "#2ECC71",
      borderWidth: 2,
    }],
  });

  const generateAnalyticsData = () => ({
    labels: ["Carrots", "Tomatoes", "Apples", "Potatoes", "Onions"],
    datasets: [{
      label: "Sales",
      data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: [
        "#2ECC7180", // Vibrant green
        "#27AE6080", // Darker green
        "#2ECC7180", // Vibrant green
        "#27AE6080", // Darker green
        "#2ECC7180", // Vibrant green
      ],
      borderColor: ["#2ECC71", "#27AE60", "#2ECC71", "#27AE60", "#2ECC71"],
      borderWidth: 2,
    }],
  });

  const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: "top", labels: { color: "#E6E6EA" } }, 
      title: { display: true, text: "Orders Graph", color: "#27AE60", font: { size: 18 } } 
    },
    scales: { x: { ticks: { color: "#E6E6EA" } }, y: { ticks: { color: "#E6E6EA" } } }
  };
  
  const pieOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: "top", labels: { color: "#E6E6EA" } }, 
      title: { display: true, text: "Analytics", color: "#27AE60", font: { size: 18 } } 
    } 
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.1 
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <motion.div 
      className={`min-h-screen p-8 ${darkMode 
        ? "bg-[#1A202C] text-[#E6E6EA]" 
        : "bg-gradient-to-br from-[#2D3748] via-[#1A202C] to-[#1A202C] text-[#E6E6EA]"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Full-screen graph */}
      {fullScreenGraph && (
        <motion.div 
          className="fixed inset-0 bg-[#1A202C]/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          <div className="bg-[#2D3748]/80 backdrop-blur-lg p-6 rounded-3xl w-11/12 max-w-4xl relative shadow-2xl border border-[#27AE60]/30">
            <button 
              className="absolute top-4 right-4 text-4xl text-[#E6E6EA] hover:text-[#2ECC71] transition-colors" 
              onClick={() => setFullScreenGraph(null)}
            >
              ×
            </button>
            {fullScreenGraph === "orders" && <Bar data={generateOrdersData()} options={chartOptions} />}
            {fullScreenGraph === "analytics" && <Pie data={generateAnalyticsData()} options={pieOptions} />}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-10 bg-[#2D3748]/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-[#27AE60]/20"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <motion.img 
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg" 
            alt="Farmer Logo" 
            className="w-16 h-16 rounded-full border-2 border-[#27AE60]/50 shadow-md"
            whileHover={{ scale: 1.1, rotate: 10 }} 
            transition={{ duration: 0.4 }} 
          />
          <div>
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight text-[#27AE60]"
              whileHover={{ scale: 1.03 }}
            >
              Hello, Farmer!
            </motion.h1>
            <motion.button 
              className="mt-3 px-6 py-2 bg-[#2ECC71] text-[#1A202C] rounded-[7px] hover:bg-[#27AE60] shadow-lg transition-all"
              onClick={() => setShowSettings(!showSettings)} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Settings
            </motion.button>
            {showSettings && (
              <motion.div 
                className="mt-4 p-4 bg-[#2D3748]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#27AE60]/20"
                initial={{ opacity: 0, y: -10}} 
                animate={{ opacity: 1, y: 0 }}
              >
                <button 
                  className="px-6 py-2 bg-[#2ECC71] text-[#1A202C] rounded-full hover:bg-[#27AE60] shadow-md transition-all"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Weather Input */}
        <motion.div 
          variants={itemVariants} 
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20"
        >
          <h3 className="font-bold text-xl text-[#27AE60]">Weather</h3>
          <input 
            type="text" 
            placeholder="Country" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            className="mt-3 p-3 w-full rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all"
          />
          <input 
            type="text" 
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="mt-2 p-3 w-full rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all"
          />
          {weather && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-center"
            >
              <img src={weatherIcon} alt="Weather" className="mx-auto w-12 h-12" />
              <p className="text-sm capitalize text-[#E6E6EA]">{weather.weather[0].description}</p>
              <p className="text-2xl font-semibold text-[#27AE60]">{weather.main.temp}°C</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Left Column */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Total Earnings</h3>
            <p className="text-4xl font-extrabold text-[#2ECC71] mt-2">₹{randomEarnings()}</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Market Prices</h3>
            <ul className="mt-2 space-y-2">
              {Object.entries(randomPrices()).map(([item, price]) => (
                <li key={item} className="text-sm text-[#E6E6EA]">{item}: <span className="text-[#2ECC71] font-semibold">₹{price}/kg</span></li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Currency Converter</h3>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="mt-3 p-3 w-full rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] placeholder-[#A0AEC0] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all"
            />
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)} 
              className="mt-2 p-3 w-full rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)} 
              className="mt-2 p-3 w-full rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none transition-all"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            {convertedAmount && (
              <p className="mt-3 text-[#2ECC71] font-semibold">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            )}
          </motion.div>
        </div>

        {/* Center Column */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Sell Surplus</h3>
            <Link to="/addpro">
              <motion.button 
                className="mt-3 px-6 py-2 bg-[#2ECC71] text-[#1A202C] rounded-[7px] hover:bg-[#27AE60] shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Product
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Crop Recommendation</h3>
            <p className="mt-2 text-[#2ECC71] font-medium">Recommended: {randomCropRecommendation()}</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setFullScreenGraph("orders")}
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Orders Graph</h3>
            <div className="mt-3 h-48">
              <Bar data={generateOrdersData()} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Your Products</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-sm text-[#E6E6EA]">Carrots: <span className="text-[#2ECC71] font-semibold">50kg</span></li>
              <li className="text-sm text-[#E6E6EA]">Tomatoes: <span className="text-[#2ECC71] font-semibold">30kg</span></li>
              <li className="text-sm text-[#E6E6EA]">Apples: <span className="text-[#2ECC71] font-semibold">20kg</span></li>
            </ul>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setFullScreenGraph("analytics")}
          >
            <h3 className="font-bold text-xl text-[#27AE60]">Analytics</h3>
            <div className="mt-3 h-48">
              <Pie data={generateAnalyticsData()} options={pieOptions} />
            </div>
          </motion.div>

          {/* Additional Farmer Features */}
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.button 
              className="w-full px-6 py-3 bg-[#2ECC71] text-[#1A202C] rounded-[8px] hover:bg-[#27AE60] shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Soil testing info")}
            >
              Soil Testing
            </motion.button>
            <motion.button 
              className="w-full px-6 py-3 bg-[#2ECC71] text-[#1A202C] rounded-[8px] hover:bg-[#27AE60] shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Market trends")}
            >
              Market Trends
            </motion.button>
            <motion.button 
              className="w-full px-6 py-3 bg-[#2ECC71] text-[#1A202C] rounded-[8px] hover:bg-[#27AE60] shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Farming tips")}
            >
              Farming Tips
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default Dashboard;