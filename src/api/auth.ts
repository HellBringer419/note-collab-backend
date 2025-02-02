import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import PasswordReset from "../models/PasswordReset";
import generateOTP from "../utils/generateOTP";
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key"; // Replace with your actual secret key

// Register User
router.post("/register", async (req, res) => {
  const { email, name, password, avatar } = req.body;
  const user = await User.create({
    email,
    name,
    avatar,
    joinedOn: new Date(),
    password: await bcrypt.hash(password, 10),
  });
  // Create a JWT token (you can adjust the payload and expiration time as needed)
  const token = jwt.sign(
    user,
    JWT_SECRET, // Secret key (store securely)
    { expiresIn: "1h" }, // Token expires in 1 hour
  );

  res.json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.withScope("includePassword").findOne({
    where: { email },
  });
  if (!user) {
    res.statusCode = 403;
    throw new Error("User not found");
  }

  // Compare provided password with the stored hash
  const isMatch = user.password
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!isMatch) {
    res.statusCode = 403;
    throw new Error("Invalid credentials");
  }

  // Create a JWT token (you can adjust the payload and expiration time as needed)
  const token = jwt.sign(
    user,
    JWT_SECRET, // Secret key (store securely)
    { expiresIn: "1h" }, // Token expires in 1 hour
  );

  delete user.password;
  res.json({ user, token });
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
