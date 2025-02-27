import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET
const token = jwt.sign(
  { id: "67bca643c1f2aeec6efda1bb", role: "farmer" },
  secret,
  { expiresIn: "1h" }
);
console.log("New token:", token);