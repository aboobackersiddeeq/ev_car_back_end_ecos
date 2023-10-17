const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecos",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
const fileFilter = (req, file, cb) => {
  if (
    !["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.mimetype)
  ) {
    return cb(new Error("File is not an image"));
  }
  return cb(null, true);
};

const upload = multer({ storage, fileFilter });
const uploadImage = (req, res, next) => {
    upload.single("img")(req, res, (err) => {
      if (err) {
        if (err.message === "File is not an image") {
          return res.status(400).json({
            status: "failed",
            message: "Selected file is not an image",
          });
        }
        return res.status(500).json({
          status: "failed",
          message: "An error occurred during file upload",
        });
      } else {
        console.log("reached to cloudinary"); 
        return next();
      }
    });
  
};

module.exports = { uploadImage ,cloudinary} ;
