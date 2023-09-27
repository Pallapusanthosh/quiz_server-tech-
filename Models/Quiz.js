const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  quizName: { type: String, required: true },
  quizCreator: { type: String, required: true },
  quizDesc: { type: String },
  quizTime: { type: String },
  quizQuestions: { type: Object, required: true },
  results: { type: [Object], default: [] },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("Quiz", quizSchema);
