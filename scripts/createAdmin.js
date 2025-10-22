// backend/scripts/createAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js"; // adjust path if needed

dotenv.config();

const MONGO = process.env.MONGO_URI;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

async function createAdmin() {
  if (!MONGO) {
    console.error("Set MONGO_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(MONGO);
  console.log("Connected");

  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const name = process.env.SEED_ADMIN_NAME || "Site Admin";
  const plain = process.env.SEED_ADMIN_PASSWORD || "simplepassword"; // your chosen simple password

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(plain, SALT_ROUNDS);
  const admin = new Admin({ name, email, password: hashed });
  await admin.save();
  console.log("Admin created:", email);
  mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
