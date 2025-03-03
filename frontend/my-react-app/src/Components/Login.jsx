import React, { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from "../firebase.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("login"); // login, register, forgotPassword

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Login Successful!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Email Registration with Verification
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      toast.success("Verification email sent! Please verify before logging in.");
      setView("login"); // Switch back to login screen
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Login with Email & Password
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        toast.success("Login Successful!");
      } else {
        toast.warning("Please verify your email before logging in.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Password Reset Function
  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email.");
      setView("login"); // Switch back to login screen
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="login-box">
        {view === "login" && (
          <>
            <h2>Zero Hunger & Sustainable Agriculture</h2>
            <p className="tagline">One App, Endless Possibilities!</p>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <div className="buttons">
              <button className="login-btn" onClick={handleLogin}>Login as Farmer</button>
              <button className="login-btn" onClick={handleLogin}>Login as Consumer</button>
            </div>

            <button className="google-btn" onClick={handleGoogleLogin}>Sign in with Google</button>
            <p className="switch-text" onClick={() => setView("register")}>New User? Register</p>
            <p className="switch-text" onClick={() => setView("forgotPassword")}>Forgot Password?</p>
          </>
        )}

        {view === "register" && (
          <>
            <h2>Create an Account</h2>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Enter a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="register-btn" onClick={handleRegister}>Register</button>
            <p className="switch-text" onClick={() => setView("login")}>Already have an account? Login</p>
          </>
        )}

        {view === "forgotPassword" && (
          <>
            <h2>Reset Password</h2>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="forgot-btn" onClick={handleForgotPassword}>Send Reset Link</button>
            <p className="switch-text" onClick={() => setView("login")}>Back to Login</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;