const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const {
  loginUser,
  registerUser,
  changePassword,
} = require("../controller/auth-controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/update", authMiddleware, changePassword);

module.exports = router;
