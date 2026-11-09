const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.param("id", validateObjectId({ message: "Order not found" }));

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders, most recent first
// @access Private
router.get(
    "/my-orders",
    protect,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();
        res.json(orders);
    })
);

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .lean();
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    })
);

module.exports = router;
