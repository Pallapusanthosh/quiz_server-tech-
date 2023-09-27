const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const userRouter = require("./Routes/User");
const quizRouter = require("./Routes/Quiz");

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json({ limit: "30mb" }));

app.use("/user", userRouter);
app.use("/quiz", quizRouter);

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    const PORT = 4001 || process.env.PORT;
    app.listen(PORT, () => {
      console.log("Server running on PORT ", PORT);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
