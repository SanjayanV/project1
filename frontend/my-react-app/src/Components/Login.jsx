// Login.jsx
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50 font-['Inter',_sans-serif]">
      {/* Top Bar */}
      <div className="bg-teal-700 text-white text-center py-4 shadow-lg">
        <h3 className="text-base font-semibold tracking-wide animate-fade-in">
          A blockchain-powered ecosystem uniting farmers and consumers for a sustainable tomorrow
          <span className="ml-3 text-teal-200 underline hover:text-white transition duration-300 cursor-pointer">
            Learn More
          </span>
        </h3>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Farmers */}
        <div className="flex-1 bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center p-8 lg:p-16 transition-all duration-500 hover:bg-gradient-to-bl">
          <div className="max-w-xl text-center lg:text-left transform hover:scale-105 transition-transform duration-300">
            <span className="inline-block bg-white text-teal-700 text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg animate-pulse">
              Farmer Empowerment
            </span>
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Thrive as a <br />
              <span className="text-amber-300">Farmer</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8 opacity-90 leading-relaxed">
              Eliminate intermediaries, boost profits, and contribute to sustainable agriculture with real-time transparency.
            </p>
            <Link to="/loginfar">
              <button className="bg-amber-400 text-teal-800 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-amber-300 hover:scale-110 transition-all duration-300">
                Join Now
              </button>
            </Link>
            <div className="flex justify-center lg:justify-start gap-6 mt-12">
              {["1150/1150302", "7417/7417717", "4062/4062297", "11998/11998153"].map((icon, idx) => (
                <img
                  key={idx}
                  src={`https://cdn-icons-png.flaticon.com/128/${icon}.png`}
                  alt={`Partner ${idx + 1}`}
                  className="w-14 h-14 opacity-80 hover:opacity-100 hover:rotate-6 transition-all duration-300"
                />
              ))}
            </div>
            {/* Additional Element: Farmer Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 text-sm">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="font-bold text-amber-300">10K+</p>
                <p className="text-gray-100">Farmers Joined</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="font-bold text-amber-300">95%</p>
                <p className="text-gray-100">Profit Increase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Consumers */}
        <div className="flex-1 bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center p-8 lg:p-16 transition-all duration-500 hover:bg-gradient-to-bl">
          <div className="max-w-xl text-center lg:text-left transform hover:scale-105 transition-transform duration-300">
            <span className="inline-block bg-white text-indigo-700 text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg animate-pulse">
              Consumer Freshness
            </span>
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Savor as a <br />
              <span className="text-pink-300">Consumer</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8 opacity-90 leading-relaxed">
              Access fresh, high-quality produce directly from farmers at unbeatable prices.
            </p>
            <Link to="/logincon">
              <button className="bg-pink-400 text-indigo-800 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-pink-300 hover:scale-110 transition-all duration-300">
                Shop Now
              </button>
            </Link>
            <div className="flex justify-center lg:justify-start gap-6 mt-12">
              {["2761/2761014", "9587/9587475", "11100/11100051", "6012/6012987"].map((icon, idx) => (
                <img
                  key={idx}
                  src={`https://cdn-icons-png.flaticon.com/128/${icon}.png`}
                  alt={`Partner ${idx + 1}`}
                  className="w-14 h-14 opacity-80 hover:opacity-100 hover:rotate-6 transition-all duration-300"
                />
              ))}
            </div>
            {/* Additional Element: Consumer Benefits */}
            <div className="mt-10 grid grid-cols-2 gap-6 text-sm">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="font-bold text-pink-300">50K+</p>
                <p className="text-gray-100">Happy Customers</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="font-bold text-pink-300">100%</p>
                <p className="text-gray-100">Fresh Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-12">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-teal-400 tracking-wide">Farmer To Consumer</h2>
            <p className="text-gray-300 mt-4 text-sm leading-relaxed">
              Transforming agriculture through innovation and connection.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">Explore</h2>
            <ul className="space-y-3">
              {["/", "/aboutus", "/resource"].map((path, idx) => (
                <li key={idx}>
                  <Link
                    to={path}
                    className="text-gray-300 hover:text-indigo-300 transition duration-300 text-sm font-medium"
                  >
                    {["Home", "About Us", "Resources"][idx]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-teal-400 mb-4">Get in Touch</h2>
            <p className="text-gray-300 text-sm">Email: support@farmertoconsumer.com</p>
            <p className="text-gray-300 text-sm">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-10">
          © 2025 Farmer To Consumer | Built for a Better Future
        </div>
      </footer>
    </div>
  );
};

export default Login;