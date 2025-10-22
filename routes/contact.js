import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Gmail Transporter (Same as used in Prayer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "jcs@jecc.ac.in", // your Gmail
    pass: process.env.MAIL_PASS || "lbakwqddkeihqagt", // Gmail App Password
  },
});

// Verify connection (once on server start)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter connection failed:", error);
  } else {
    console.log("✅ Mail transporter ready for Contact form!");
  }
});

// ✅ POST route — when form is submitted
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Email content to send to SABS admin
    const adminMail = {
      from: `"SABS Website" <${email}>`,
      to: "sandraps@jecc.ac.in", // Receiver email (you)
      subject: `📩 New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <br>
        <p>— Sent automatically from the SABS Contact Page</p>
      `,
    };

    // Confirmation email back to user
    const userMail = {
      from: `"SABS Community" <jcs@jecc.ac.in>`,
      to: email,
      subject: "📬 Your message has been received!",
      html: `
        <h2>Dear ${name || "Friend"},</h2>
        <p>Thank you for reaching out to SABS. We have received your message and will get back to you shortly.</p>
        <p>May God bless you abundantly!</p>
        <br>
        <p><b>With warm regards,</b><br>SABS Community</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    console.log(`✅ Contact form mail sent successfully to ${email}`);
    res.status(200).json({ success: true, message: "Mail sent successfully" });
  } catch (error) {
    console.error("❌ Contact Mail Error:", error);
    res.status(500).json({ success: false, message: "Mail sending failed" });
  }
});

export default router;
