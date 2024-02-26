const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenCheck = require("../Middleware/tokenCheck");
const User = require("../Models/User");
const router = express.Router();

router.get("/", tokenCheck, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
        name: result.name,
        password: result.password,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );
    user.password = "";
    res.status(200).json({ user: result, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Credentials are wrong" });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        name: existingUser.name,
        password: existingUser.password,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );
    res.status(200).json({ user: existingUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
