const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb" }));

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log("Server running on PORT ", PORT);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
