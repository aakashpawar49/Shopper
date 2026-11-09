const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const products = await Product.find({}).lean();
        res.json(products);
    })
);

module.exports = router;
