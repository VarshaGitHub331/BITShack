const cloudinary = require("../utils/Cloudinary");
const fs = require("fs");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "PatientDocs", // Save in Cloudinary folder
      resource_type: "raw", // Upload as raw file (non-image)
      access_mode: "public", // Ensure public access to the document
    });

    // Save Cloudinary URL in request object to use in further processing
    req.documentUrl = result.secure_url;

    // Delete file from local storage after upload to Cloudinary
    fs.unlinkSync(req.file.path);

    next(); // Proceed to the next middleware or route handler
  } catch (e) {
    next(e);
  }
};

module.exports = { uploadDocument };
