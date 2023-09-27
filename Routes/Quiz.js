const express = require("express");
const tokenCheck = require("../Middleware/tokenCheck");
const Quiz = require("../Models/Quiz");
const router = express.Router();

router.get("/", tokenCheck, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const newQuiz = await new Quiz(data);
    newQuiz.save();
    console.log(newQuiz);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", tokenCheck, async (req, res) => {
  const { id } = req.params;
  try {
    const newQuiz = await Quiz.findById(id);
    res.status(200).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", tokenCheck, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    console.log(deletedQuiz);
  } catch (error) {
    console.log("Error : ", error.message);
  }
});

router.post("/:id/result", async (req, res) => {
  const { id } = req.params;
  const { quizResult } = req.body;
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        $push: { results: quizResult },
      },
      { new: true, useFindAndModify: false }
    );
    console.log(updatedQuiz);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
