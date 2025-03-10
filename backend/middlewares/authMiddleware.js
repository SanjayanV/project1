import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  console.log("Authorization header:", req.headers.authorization); // Debug header

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Extracted token:", token); // Debug token
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug decoded payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // Debug verification error
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
};
export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Received token:", token); // Debug log

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    req.user = { id: decoded._id }; // Use _id instead of id
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Debug log
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};