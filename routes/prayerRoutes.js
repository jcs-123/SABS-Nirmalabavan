import express from "express";
import {
  createPrayer,
  getPrayers,
  sendAutoMail,
  sendCustomMail
} from "../controllers/prayerController.js";

const router = express.Router();

router.post("/", createPrayer);           // public form
router.get("/", getPrayers);              // admin view
router.post("/auto-mail", sendAutoMail);  // auto reply
router.post("/custom-mail", sendCustomMail); // custom reply

export default router;
