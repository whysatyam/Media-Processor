const { User } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";


async function signup(req, res) {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
}

module.exports = { signup, login };
