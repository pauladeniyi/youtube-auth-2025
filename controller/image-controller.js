const Image = require("../models/image");
const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const cloudinary = require("../config/cloudinary");

const fs = require("fs");
const uploadImageController = async (req, res) => {
  try {
    // check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required. Upload a new image",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the image url, public Id and also the uploader userId
    const newlyUploadedImage = await Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// fetch images
const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        message: "Image successfully fetched",
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// delete image
const deleteImageController = async (req, res) => {
  try {
    // get the ID of the image to be deleted
    const imageId = req.params.id;

    // get the ID of the current user logged in
    const userId = req.userInfo.userId;

    // get the image to be deleted
    const image = await Image.findById(imageId);

    if (!image) {
      res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // check if the current admin uploaded the image to be deleted
    if (image.uploadedBy.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete the image",
      });
    }

    // delete the image first from cloudinary
    cloudinary.uploader.destroy(image.publicId);

    // delete the image from MongoDB
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({
      success: true,
      message: "Image successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
