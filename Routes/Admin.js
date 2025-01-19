const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminTokenCheck = require("../Middleware/tokenCheck");
const Quiz = require("../Models/Quiz");
const Admin = require("../Models/Admin");
const router = express.Router();

router.get("/admin",async(req,res)=>{
   res.status(202).json({message:'hii'});
})

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully." ,admin:newAdmin});
  } catch (error) {
    console.error("Sign-Up Error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});

// Admin Sign-In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email});
    if (!existingAdmin) return res.status(404).json({ message: "Admin not found." });

    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });

    const loginToken = jwt.sign(
      { email: existingAdmin.email, id: existingAdmin._id, isAdmin: true },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    existingAdmin.loginToken = loginToken;
    await existingAdmin.save();

    res.status(200).json({ admin: existingAdmin, loginToken });
  } catch (error) {
    console.error("Sign-In Error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});

// Admin Logout
router.post("/logout", adminTokenCheck, adminTokenCheck, async (req, res) => {
  try {
    req.user.loginToken = null; // Clear the login token
    await req.user.save();
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.post("/", adminTokenCheck, adminTokenCheck, async (req, res) => {
  const { action, quizId, title, questions, category } = req.body;

  try {
    switch (action) {
      case "add":
        const newQuiz = new Quiz({ title, questions, category, quizCreator: req.user.id });
        await newQuiz.save();
        return res.status(201).send("Quiz added successfully.");

      case "update":
        const updatedQuiz = await Quiz.findByIdAndUpdate(
          quizId,
          { title, questions, category },
          { new: true }
        );
        if (!updatedQuiz) return res.status(404).send("Quiz not found.");
        return res.status(200).send("Quiz updated successfully.");

      case "delete":
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
        if (!deletedQuiz) return res.status(404).send("Quiz not found.");
        return res.status(200).send("Quiz deleted successfully.");

      default:
        return res.status(400).send("Invalid action.");
    }
  } catch (error) {
    console.error("Admin Action Error:", error.message);
    res.status(500).send("Error handling admin action.");
  }
});

module.exports = router;
