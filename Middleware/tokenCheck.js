const jwt = require("jsonwebtoken");

const tokenCheck = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "User not found" });
  }
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    if (!user) {
      return res.status(403).json({ message: "Session expired" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(409).json({ message: "Invalid Session" });
  }
};

module.exports = tokenCheck;
