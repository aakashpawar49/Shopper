const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

const ORDER_NOT_FOUND = { message: "Order not found" };

router.param("id", validateObjectId(ORDER_NOT_FOUND));

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const orders = await Order.find({}).populate("user", "name email").lean();
        res.json(orders);
    })
);

// @route PUT /api/admin/orders/:id
// @desc Update order status (Admin only)
// @access Private/Admin
router.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id).populate("user", "name");
        if (!order) return res.status(404).json(ORDER_NOT_FOUND);

        order.status = req.body.status || order.status;
        if (req.body.status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    })
);

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json(ORDER_NOT_FOUND);

        res.json({ message: "Order removed" });
    })
);

module.exports = router;
