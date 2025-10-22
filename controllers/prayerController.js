import Prayer from "../models/Prayer.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Setup mail transporter (SABS Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "jcs@jecc.ac.in",
    pass: process.env.MAIL_PASS || "lbakwqddkeihqagt", // Gmail App Password
  },
});

// Verify once when server starts
transporter.verify((err, success) => {
  if (err) console.error("❌ Mail transporter error:", err);
  else console.log("✅ Mail transporter ready (Prayer notifications)");
});

// ✅ 1️⃣ Add a new prayer request
export const createPrayer = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Save to database
    const prayer = new Prayer({ name, email, phone, message });
    await prayer.save();

    // ✅ Send notification mail to admin
    const mailOptions = {
      from: `"SABS Prayer Portal" <${process.env.MAIL_USER}>`,
      to: "sandraps@jecc.ac.in", // admin recipient
      subject: `📩 New Prayer Request from ${name}`,
      html: `
        <div style="font-family: Poppins, sans-serif;">
          <h2>New Prayer Request Received</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || "N/A"}</p>
          <p><b>Message:</b><br>${message}</p>
          <br>
          <p style="font-size:0.9em;color:#555;">— Sent automatically from SABS Prayer Portal</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notified about new prayer from ${name}`);

    res.status(201).json({ success: true, message: "Prayer saved & admin notified" });
  } catch (error) {
    console.error("❌ Error creating prayer:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 2️⃣ Get all prayer requests (for admin panel)
export const getPrayers = async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ (Optional) Admin can manually reply or auto-reply later
export const sendAutoMail = async (req, res) => {
  const { email, name } = req.body;
  try {
    const mailOptions = {
      from: `"SABS Community" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "🙏 Your Prayer Request Has Been Received",
      html: `
        <h2>Dear ${name || "Friend"},</h2>
        <p>We have received your prayer request and our sisters will include you in our daily prayers within 24 hours.</p>
        <p>May God bless you and grant you peace.</p>
        <br>
        <p><b>With prayers,</b><br>SABS Community</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Auto-mail sent successfully" });
  } catch (error) {
    console.error("❌ Auto mail error:", error);
    res.status(500).json({ error: "Failed to send auto mail" });
  }
};

// ✅ 3️⃣ Send custom mail (from admin manually)
export const sendCustomMail = async (req, res) => {
  const { email, subject, body } = req.body;
  try {
    const mailOptions = {
      from: `"SABS Community" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Custom mail sent successfully" });
  } catch (error) {
    console.error("❌ Custom mail error:", error);
    res.status(500).json({ error: "Failed to send custom mail" });
  }
};
