// backend/controllers/adminAuthController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "2d";
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to protect routes
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing Authorization header" });
  const token = header.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.adminId = decoded.id;
    next();
  });
};
