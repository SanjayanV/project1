import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", credentials, { withCredentials: true });
      const { token } = response.data; // Assuming your backend returns a token
      localStorage.setItem("token", token); // For header-based auth
      setAuth(true);
      console.log("Login Successfull")  
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
    }
  };

  return (
    <div className="d-flex items-center justify-center h-[100vh] w-auto">
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg d-flex h-[500px] text-center justify-center">
      <h2 className="text-2xl font-bold text-teal-800 mb-4">Login</h2>
      <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" className="w-full p-3 mb-3 rounded-lg border border-teal-200" required />
      <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" className="w-full p-3 mb-3 rounded-lg border border-teal-200" required />
      <button type="submit" className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Login</button>
    </form></div>
  );
};

export default Login;