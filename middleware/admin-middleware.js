const adminMiddleware = (req, res, next) => {
  console.log(req.userInfo);
  if (req.userInfo.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Access denied. You are not registered as admin",
    });
  }
  next();
};

module.exports = adminMiddleware;
