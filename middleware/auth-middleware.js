const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
    });
  }

  // Decode the token
  try {
    const decodedUserInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userInfo = decodedUserInfo;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access denied. No token provided. Please login to continue",
    });
  }

  next();
};

module.exports = authMiddleware;
