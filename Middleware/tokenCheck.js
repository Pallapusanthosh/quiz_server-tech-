const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin"); // Change User to Admin

const adminTokenCheck = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Authorization token missing." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(decodedToken.id); // Change User to Admin

    if (!admin || !admin.isAdmin || admin.loginToken !== token) {
      return res.status(403).json({ message: "Unauthorized or invalid session." });
    }

    req.user = admin; // Attach admin details to the request
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = adminTokenCheck;