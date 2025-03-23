const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadImageMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  fetchImageController,
  deleteImageController,
} = require("../controller/image-controller");
const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadImageMiddleware.single("image"),
  uploadImageController
);

router.get("/fetch-image", authMiddleware, fetchImageController);

router.delete(
  "/delete-image/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);

module.exports = router;
