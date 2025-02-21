import { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      setMessage({ text: "User registered successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Something went wrong.", type: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center w-[1080px] min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add User</h2>
        {message && (
          <p className={`text-center p-2 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex items-center border p-2 rounded focus-within:ring-2 focus-within:ring-blue-500">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border p-2 rounded focus-within:ring-2 focus-within:ring-blue-500">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border p-2 rounded focus-within:ring-2 focus-within:ring-blue-500">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full outline-none"
            />
          </div>
          <div className="flex items-center border p-2 rounded focus-within:ring-2 focus-within:ring-blue-500">
            <FaUserTag className="text-gray-500 mr-2" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            >
              <option value="farmer">Farmer</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Register User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
