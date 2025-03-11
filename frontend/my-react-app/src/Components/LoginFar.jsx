import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "../firebase.js";
import { getDatabase, ref, set, get } from "firebase/database"; // Firebase Realtime Database
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);

  const navigate = useNavigate();
  const db = getDatabase();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Logged in user:", user.uid, user.email, user.displayName);

      // Check if user exists in Firebase Realtime Database
      if (!get || typeof get !== "function") {
        throw new Error("Firebase 'get' function is not available. Check your imports or Firebase setup.");
      }

      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      console.log("Firebase snapshot exists:", userSnapshot.exists());
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        console.log("User data from Firebase:", userData);

        const userRole = userData.role;
        if (userRole) {
          console.log("User role found:", userRole);

          // Use Firebase ID token for authentication
          const token = await user.getIdToken();
          localStorage.setItem("token", token);
          localStorage.setItem("role", userRole);
          localStorage.setItem("userDetails", JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: userData.name || user.displayName,
          }));

          toast.success("Login Successful!");
          setAuth(true);
          setTimeout(() => {
            navigate(userRole === "farmer" ? "/dashboard" : "/home");
          }, 100);
        } else {
          console.log("No role found for existing user, prompting role selection");
          setGoogleUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Google User",
          });
        }
      } else {
        console.log("New user detected, prompting role selection");
        setGoogleUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Google User",
        });
      }
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error(error.message || "Google login failed");
    }
  };

  const handleGoogleSync = async () => {
    if (!googleUser || !role) {
      toast.error("Role is required for Google sign-up!");
      return;
    }
    try {
      const userData = { ...googleUser, role };
      await set(ref(db, `users/${googleUser.uid}`), {
        email: googleUser.email,
        name: googleUser.name,
        uid: googleUser.uid,
        role,
        createdAt: new Date().toISOString(),
      });

      // Use Firebase ID token
      const user = auth.currentUser;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Sign-up Successful!");
      setGoogleUser(null);
      setAuth(true);
      navigate(role === "farmer" ? "/dashboard" : "/home");
    } catch (error) {
      console.error("Google sync error:", error.message);
      toast.error(error.message || "Failed to complete Google sign-up");
      setGoogleUser(null);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and Password are required!");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        throw new Error("User data not found in database");
      }
      const userData = snapshot.val();
      const userRole = userData.role;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      toast.success("Login Successful!");
      setAuth(true);
      navigate(userRole === "farmer" ? "/dashboard" : "/home");
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message || "Login failed. Please check your credentials.");
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        email,
        name,
        uid: user.uid,
        role,
        createdAt: new Date().toISOString(),
      });

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Sign-up Successful!");
      setAuth(true);
      setView("login");
    } catch (error) {
      console.error("Register error:", error.message);
      toast.error(error.message || "Sign-up failed");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email");
    }
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
                placeholder="Your email"
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
                disabled // Role is only editable during signup
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

export default Login;