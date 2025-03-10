import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
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
  const [userName, setUserName] = useState("");
  const [earnings, setEarnings] = useState(0);
  const [marketPrices, setMarketPrices] = useState({});
  const [ordersData, setOrdersData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [cropRecommendation, setCropRecommendation] = useState("");
  const [auth,setAuth] = useState(null);


  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const barChartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Orders Overview" } },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Earnings Distribution" } },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token on mount:", token);
    if (!token) {
      console.warn("No token found, redirecting to login");
      window.location.href = "/login";
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log("Sending Authorization header:", config.headers.Authorization);

    axios
      .get("http://localhost:5000/api/auth/me", config)
      .then((response) => {
        console.log("Me response (full):", response.data);
        setUserName(response.data.name || "Farmer");
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        console.log("Error response:", error.response?.data || error.message);
      });

    axios
      .get("http://localhost:5000/api/farmer/earnings", config)
      .then((response) => setEarnings(response.data.earnings))
      .catch((error) => console.error("Error fetching earnings:", error));

    axios
      .get("http://localhost:5000/api/farmer/market-prices", config)
      .then((response) => setMarketPrices(response.data))
      .catch((error) => console.error("Error fetching market prices:", error));

    // Fetch weather data (example API, replace with your weather API)
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city || "Delhi"},${country || "IN"}&appid=YOUR_API_KEY&units=metric`)
      .then((response) => {
        setWeather(response.data.main);
        setWeatherIcon(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
      })
      .catch((error) => console.error("Error fetching weather:", error));

    // Fetch currency conversion (example API, replace with your currency API)
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((response) => {
        const rate = response.data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch((error) => console.error("Error fetching currency:", error));

    // Mock data for charts (replace with actual API calls if available)
    setOrdersData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{ label: "Orders", data: [12, 19, 3, 5, 2], backgroundColor: "rgba(39, 174, 96, 0.6)" }],
    });

    setAnalyticsData({
      labels: ["Crops", "Livestock", "Other"],
      datasets: [{ data: [300, 50, 100], backgroundColor: ["#27AE60", "#E74C3C", "#3498DB"] }],
    });

    // Mock crop recommendation (replace with AI/ML API if available)
    setCropRecommendation("Based on current weather, consider planting Wheat or Rice.");
  }, [city, country, fromCurrency, toCurrency, amount]);

  const handleCurrencyConvert = () => {
    axios
      .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((response) => {
        const rate = response.data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch((error) => console.error("Error fetching currency:", error));
  };

  return (
    <motion.div
      className={`min-h-screen p-6 md:p-8 ${
        darkMode ? "bg-[#1A202C] text-[#E6E6EA]" : "bg-gradient-to-br from-[#2D3748] via-[#1A202C] to-[#1A202C] text-[#E6E6EA]"
      }`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hello, {userName}!</h1>
        <div>
          <button
            className="px-4 py-2 bg-[#2ECC71] text-[#1A202C] rounded-lg font-medium hover:bg-[#27AE60] mr-2 shadow-lg transition-all"
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
          </button>
          <Link to="/login">
            <button className="px-4 py-2 bg-[#E74C3C] text-[#E6E6EA] rounded-lg font-medium hover:bg-[#C0392B] shadow-lg transition-all">
              Logout
            </button>
          </Link>
        </div>
      </div>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 bg-[#2D3748]/80 p-4 rounded-lg shadow-lg border border-[#27AE60]/20"
        >
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="mr-2"
            />
            Dark Mode
          </label>
          <div className="mt-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-2 rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none ml-2"
            />
          </div>
          <div className="mt-2">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="p-2 rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none ml-2 w-20"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="p-2 rounded-lg bg-[#1A202C]/70 border border-[#27AE60]/30 text-[#E6E6EA] focus:ring-2 focus:ring-[#2ECC71] focus:outline-none ml-2"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button
              onClick={handleCurrencyConvert}
              className="px-4 py-2 bg-[#2ECC71] text-[#1A202C] rounded-lg font-medium hover:bg-[#27AE60] ml-2 shadow-lg transition-all"
            >
              Convert
            </button>
            {convertedAmount && <span className="ml-2 text-[#E6E6EA]">{convertedAmount} {toCurrency}</span>}
          </div>
          <button
            className="mt-2 px-4 py-2 bg-[#E74C3C] text-[#E6E6EA] rounded-lg font-medium hover:bg-[#C0392B] shadow-lg transition-all"
            onClick={() => setShowSettings(false)}
          >
            Close
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Weather</h3>
          {weather ? (
            <div>
              <img src={weatherIcon} alt="Weather Icon" className="w-16 mx-auto mb-2" />
              <p>Temperature: {weather.temp}°C</p>
              <p>Feels Like: {weather.feels_like}°C</p>
              <p>Humidity: {weather.humidity}%</p>
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Earnings</h3>
          <p className="text-2xl">₹{earnings.toLocaleString()}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Market Prices</h3>
          {Object.entries(marketPrices).length > 0 ? (
            <ul>
              {Object.entries(marketPrices).map(([crop, price]) => (
                <li key={crop} className="text-sm">
                  {crop}: ₹{price}/kg
                </li>
              ))}
            </ul>
          ) : (
            <p>No market prices available.</p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow col-span-2"
          onClick={() => setFullScreenGraph(fullScreenGraph === "bar" ? null : "bar")}
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Orders Overview</h3>
          <Bar data={ordersData} options={barChartOptions} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow"
          onClick={() => setFullScreenGraph(fullScreenGraph === "pie" ? null : "pie")}
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Earnings Distribution</h3>
          <Pie data={analyticsData} options={pieChartOptions} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="p-6 bg-[#2D3748]/80 backdrop-blur-lg rounded-2xl shadow-lg border border-[#27AE60]/20 hover:shadow-xl transition-shadow col-span-3"
        >
          <h3 className="font-bold text-lg text-[#27AE60] mb-3">Crop Recommendation</h3>
          <p>{cropRecommendation}</p>
        </motion.div>
      </div>

      {fullScreenGraph && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setFullScreenGraph(null)}
        >
          <div className="w-3/4 h-3/4">
            {fullScreenGraph === "bar" && <Bar data={ordersData} options={barChartOptions} />}
            {fullScreenGraph === "pie" && <Pie data={analyticsData} options={pieChartOptions} />}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;