// utils/cloudinaryStorage.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "assignment_submissions",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto", // allow images and pdfs
  },
});

module.exports = storage;
