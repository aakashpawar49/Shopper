const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// Cloudinary Configuration (server.js loads .env before this module)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Keep uploads in memory and cap their size so one request can't exhaust RAM
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Stream a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
        });
        stream.end(fileBuffer);
    });

router.post(
    "/",
    upload.single("image"),
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        // Respond with uploaded image URL
        res.json({ imageUrl: result.secure_url });
    })
);

module.exports = router;
