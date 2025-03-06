import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Loginfar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer"); // Default for email/password forms
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [googleUser, setGoogleUser] = useState(null); // Store Google user data temporarily

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const checkData = { uid: user.uid };
      const response = await axios.post("http://localhost:5000/api/auth/check-user", checkData);
      console.log(response);
  
      if (response.data.exists) {
        // Assuming backend returns user details including { token, role, ...otherDetails }
        const { token, role: userRole, ...userDetails } = response.data;
        console.log(role)
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Store other user details if needed
        toast.success("Login Successful!");
        navigate(role === "farmer" ? "/dashboard" : "/home");
      } else {
        setGoogleUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Google User",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleGoogleSync = async () => {
    if (!googleUser || !role) {
      toast.error("Role is required for Google sign-up!");
      return;
    }
    try {
      const userData = { ...googleUser, role };
      const response = await axios.post("http://localhost:5000/api/auth/sync-google-user", userData);
      // Assuming backend returns { token, message }
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token
      localStorage.setItem("role", role); // Store selected role
      toast.success(response.data.message || "Sign-up Successful!");
      setGoogleUser(null);
      navigate(role === "farmer" ? "/dashboard" : "/home");
      console.log(role)
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      setGoogleUser(null);
    }
  };

  const handleLogin = async () => {
    if (!email || !password || !role) {
      toast.error("Email, Password, and Role are required!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password,
        role,
      });
      // Assuming backend returns { token, role, message }
      const { token, role: userRole } = response.data;
      localStorage.setItem("token", token); // Store token
      localStorage.setItem("role", userRole || role); // Store role (use backend role if provided)
      toast.success(response.data.message);
      navigate(role === "farmer" ? "/dashboard" : "/home");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name || !role) {
      toast.error("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
        name,
        role,
      });
      toast.success(response.data.message);
      setView("login");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset not implemented yet. Contact support.");
  };

  return (
    <div className="flex h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Left Side - Video Background */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source src="/left.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-4xl font-bold">FARMER TO CONSUMER COMMUNITY</h1>
          <p className="mt-2 text-gray-300">Home to Millions of people worldwide</p>
          <a href="#" className="mt-2 inline-block text-green-400">Know more</a>
        </div>
      </div>

      {/* Right Side - Login / Signup Form or Google Role Selection */}
      <div
        className={`w-1/2 flex flex-col justify-center items-center p-10 bg-white transition-transform duration-500 ${
          view === "signup" ? "-translate-x-full" : ""
        }`}
      >
        {googleUser ? (
          // Role selection step for new Google users
          <div className="w-full max-w-sm mt-5">
            <h2 className="text-3xl font-bold">Select Your Role</h2>
            <p className="mt-1 text-gray-500">Please choose your role to complete sign-up.</p>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
              value={googleUser.email}
              disabled
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
              value={googleUser.name}
              disabled
            />
            <select
              className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="farmer">Farmer</option>
              <option value="consumer">Consumer</option>
            </select>
            <button
              className="w-full p-3 bg-purple-300 text-white rounded-md hover:bg-purple-500"
              onClick={handleGoogleSync}
            >
              Complete Sign-Up
            </button>
            <button
              className="w-full p-3 mt-3 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => setGoogleUser(null)}
            >
              Cancel
            </button>
          </div>
        ) : view === "login" ? (
          <>
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-1 text-gray-500">It's nice to see you again. Ready to sell?</p>
            <div className="w-full max-w-sm mt-5">
              <input
                type="email"
                placeholder="Your username or email"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  👁
                </span>
              </div>
              <select
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="farmer">Farmer</option>
                <option value="consumer">Consumer</option>
              </select>
              <button
                className="w-full p-3 bg-purple-300 text-white rounded-md hover:bg-purple-500"
                onClick={handleLogin}
              >
                Log In
              </button>
              <div className="flex justify-between mt-3 text-sm">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="text-blue-500" onClick={handleForgotPassword}>
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center my-5 text-gray-500">
                <hr className="flex-grow" /> <span className="mx-2">or</span>{" "}
                <hr className="flex-grow" />
              </div>
              <button
                className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                  alt="Google"
                  className="w-5 mr-2"
                />
                Continue with Google
              </button>
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <a href="#" className="text-blue-500" onClick={() => setView("signup")}>
                  Sign up
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <p className="mt-1 text-gray-500">Join our community today!</p>
            <div className="w-full max-w-sm mt-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  👁
                </span>
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <select
                className="w-full p-3 mb-3 border border-gray-300 rounded-md hover:bg-gray-100"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="farmer">Farmer</option>
                <option value="consumer">Consumer</option>
              </select>
              <button
                className="w-full p-3 bg-purple-300 text-white rounded-md hover:bg-purple-500"
                onClick={handleRegister}
              >
                Sign Up
              </button>
              <p
                className="mt-3 text-center text-gray-700 hover:scale-105 cursor-pointer"
                onClick={() => setView("login")}
              >
                Already have an account? Log in
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Loginfar;