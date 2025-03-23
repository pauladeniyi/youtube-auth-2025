const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  const { userId, username, email, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to homepage",
    data: {
      _id: userId,
      username,
      email,
      role,
    },
  });
});

module.exports = router;
