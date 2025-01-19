const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    quizName: { type: String, required: true },
    quizCreator: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
    quizDesc: { type: String, default: "" },
    quizTime: { type: String, default: "00:30:00" },
    quizCategory: { type: String, required: true },
    quizQuestions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
    results: [
      {
        participant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number },
        takenAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
