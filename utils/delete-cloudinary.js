const { cloudinary } = require("./cloudinary");

const extractPathWithoutExtensionFromCloudinaryURL = (cloudinaryURL) => {
  const pathRegex = /upload\/(v\d+\/)?(.+)\.\w+$/i;
  const pathMatch = cloudinaryURL.match(pathRegex);

  if (pathMatch && pathMatch[2]) {
    return pathMatch[2];
  } else {
    console.error("Invalid Cloudinary URL");
    return null;
  }
};

const cloudinaryImageDelete = async (cloudinaryURL) => {
  // Extract the public ID from the Cloudinary URL
  const publicId =await extractPathWithoutExtensionFromCloudinaryURL(cloudinaryURL);
  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      return {
        status: "failed",
        messege: "Error deleting image from Cloudinary",
        error,
      };
    } else {
      return {
        status: "success",
        messege: "Image deleted successfully from Cloudinary",
        result,
      };
    }
  });
};

module.exports = cloudinaryImageDelete;
