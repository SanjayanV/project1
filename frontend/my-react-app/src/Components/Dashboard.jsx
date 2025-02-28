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

  // Chart data
  const generateOrdersData = () => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Orders",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 2,
    }],
  });

  const generateAnalyticsData = () => ({
    labels: ["Carrots", "Tomatoes", "Apples", "Potatoes", "Onions"],
    datasets: [{
      label: "Sales",
      data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", 
                   "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
      borderWidth: 2,
    }],
  });

  const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: "top" }, 
      title: { display: true, text: "Orders Graph" } 
    } 
  };
  
  const pieOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: "top" }, 
      title: { display: true, text: "Analytics" } 
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
        ? "bg-gray-900 text-white" 
        : "bg-gradient-to-br from-emerald-50 via-lime-50 to-cyan-50 text-gray-800"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Full-screen graph */}
      {fullScreenGraph && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-2xl w-11/12 max-w-4xl relative shadow-2xl">
            <button className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800" onClick={() => setFullScreenGraph(null)}>×</button>
            {fullScreenGraph === "orders" && <Bar data={generateOrdersData()} options={chartOptions} />}
            {fullScreenGraph === "analytics" && <Pie data={generateAnalyticsData()} options={pieOptions} />}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <motion.img 
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg" 
            alt="Farmer Logo" 
            className="w-16 h-16 rounded-full border-2 border-emerald-200"
            whileHover={{ scale: 1.1, rotate: 360 }} 
            transition={{ duration: 0.5 }} 
          />
          <div>
            <motion.h1 
              className="text-3xl font-bold tracking-tight text-emerald-800"
              whileHover={{ scale: 1.05 }}
            >
              Hello, Farmer!
            </motion.h1>
            <motion.button 
              className="mt-3 px-5 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 shadow-md"
              onClick={() => setShowSettings(!showSettings)} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Settings
            </motion.button>
            {showSettings && (
              <motion.div 
                className="mt-3 p-4 bg-white rounded-lg shadow-xl border border-emerald-100"
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
              >
                <button 
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md"
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
          className="p-5 bg-cyan-100/80 rounded-xl shadow-lg border border-cyan-200"
        >
          <h3 className="font-bold text-lg text-cyan-800">Weather</h3>
          <input 
            type="text" 
            placeholder="Country" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            className="mt-3 p-2 w-full rounded-lg text-gray-800 bg-white/90 border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="mt-2 p-2 w-full rounded-lg text-gray-800 bg-white/90 border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
          {weather && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 text-center"
            >
              <img src={weatherIcon} alt="Weather" className="mx-auto w-12 h-12" />
              <p className="text-sm capitalize">{weather.weather[0].description}</p>
              <p className="text-xl font-semibold">{weather.main.temp}°C</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {/* Left Column */}
        <div className="space-y-8">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-purple-100/80 rounded-2xl shadow-lg border border-purple-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-purple-800">Total Earnings</h3>
            <p className="text-4xl font-semibold text-purple-900 mt-2">₹{randomEarnings()}</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-orange-100/80 rounded-2xl shadow-lg border border-orange-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-orange-800">Market Prices</h3>
            <ul className="mt-2 space-y-1 text-orange-900">
              {Object.entries(randomPrices()).map(([item, price]) => (
                <li key={item}>{item}: ₹{price}/kg</li>
              ))}
            </ul>
          </motion.div>

          {/* Currency Converter */}
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-green-100/80 rounded-2xl shadow-lg border border-green-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-green-800">Currency Converter</h3>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="mt-3 p-2 w-full rounded-lg text-gray-800 bg-white/90 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)} 
              className="mt-2 p-2 w-full rounded-lg text-gray-800 bg-white/90 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)} 
              className="mt-2 p-2 w-full rounded-lg text-gray-800 bg-white/90 border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            {convertedAmount && (
              <p className="mt-3 text-green-900 font-semibold">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            )}
          </motion.div>
        </div>

        {/* Center Column */}
        <div className="space-y-8">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-blue-100/80 rounded-2xl shadow-lg border border-blue-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-blue-800">Sell Surplus</h3>
            <Link to="/addpro">
              <motion.button 
                className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Product
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-yellow-100/80 rounded-2xl shadow-lg border border-yellow-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-yellow-800">Crop Recommendation</h3>
            <p className="mt-2 text-yellow-900 font-medium">Recommended: {randomCropRecommendation()}</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-red-100/80 rounded-2xl shadow-lg border border-red-200 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setFullScreenGraph("orders")}
          >
            <h3 className="font-bold text-xl text-red-800">Orders Graph</h3>
            <div className="mt-3 h-40">
              <Bar data={generateOrdersData()} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-indigo-100/80 rounded-2xl shadow-lg border border-indigo-200 backdrop-blur-sm"
          >
            <h3 className="font-bold text-xl text-indigo-800">Your Products</h3>
            <ul className="mt-2 space-y-1 text-indigo-900">
              <li>Carrots: 50kg</li>
              <li>Tomatoes: 30kg</li>
              <li>Apples: 20kg</li>
            </ul>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="p-6 bg-teal-100/80 rounded-2xl shadow-lg border border-teal-200 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setFullScreenGraph("analytics")}
          >
            <h3 className="font-bold text-xl text-teal-800">Analytics</h3>
            <div className="mt-3 h-40">
              <Pie data={generateAnalyticsData()} options={pieOptions} />
            </div>
          </motion.div>

          {/* Additional Farmer Features */}
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.button 
              className="w-full px-5 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Soil testing info")}
            >
              Soil Testing
            </motion.button>
            <motion.button 
              className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Market trends")}
            >
              Market Trends
            </motion.button>
            <motion.button 
              className="w-full px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
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
};

export default Dashboard;