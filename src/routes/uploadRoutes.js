const express = require("express");
const router = express.Router();
const {
  uploadSingle,
  uploadMultiple,
  handleUploadErrors,
} = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

// Single image upload route
router.post("/upload-single", uploadSingle, handleUploadErrors, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const imageUrl = `/images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// Multiple images upload route
router.post(
  "/upload-multiple",
  uploadMultiple,
  handleUploadErrors,
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: `/images/${file.filename}`,
      }));

      res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading files",
        error: error.message,
      });
    }
  }
);

// Get all uploaded images
router.get("/images", (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "../../public/images");

    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error reading images directory",
        });
      }

      const imageFiles = files
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
        })
        .map((file) => ({
          filename: file,
          url: `/images/${file}`,
        }));

      res.status(200).json({
        success: true,
        data: {
          images: imageFiles,
          count: imageFiles.length,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message,
    });
  }
});

// DELETE route 
router.delete("/upload/delete/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    console.log("Delete request for filename:", filename);

    // Security check: prevent directory traversal
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename",
      });
    }

    const filePath = path.join(__dirname, "../../public/images", filename);
    console.log("Full file path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log("File not found:", filePath);
      return res.status(404).json({
        success: false,
        message: `File not found: ${filename}`,
      });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting file from server",
          error: err.message,
        });
      }

      console.log("File deleted successfully:", filename);
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
        deletedFile: filename,
      });
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during deletion",
      error: error.message,
    });
  }
});



module.exports = router;
