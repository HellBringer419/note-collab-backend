import express from "express";
import User from "../models/User";
import PasswordReset from "../models/PasswordReset";
import generateOTP from "../utils/generateOTP";
const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { email, name } = req.body;
  const user = await User.create({ email, name });
  res.json(user);
});

// Login User (simplified for demo)
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found");
  }
  res.json(user);
});
// Request Password Reset
router.post("/password-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found");
  }

  const otp = generateOTP();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // OTP valid for 10 minutes

  await PasswordReset.create({ userId: user.id, otp, expiry });
  res.send("OTP sent to your email");
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.statusCode = 404;
    throw new Error("User not found");
  }

  const passwordReset = await PasswordReset.findOne({
    where: { userId: user.id, otp },
  });

  if (!passwordReset || passwordReset.expiry < new Date()) {
    res.statusCode = 400;
    throw new Error("Invalid or expired OTP");
  }

  res.send("OTP verified");
});
export default router;
