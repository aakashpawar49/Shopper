const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

const CHECKOUT_NOT_FOUND = { msg: "Checkout not found" };

router.param("id", validateObjectId(CHECKOUT_NOT_FOUND));

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (!checkoutItems || checkoutItems.length === 0) {
            return res.status(400).json({ msg: "No items in cart" });
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });
        res.status(201).json(newCheckout);
    })
);

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put(
    "/:id/pay",
    protect,
    asyncHandler(async (req, res) => {
        const { paymentStatus, paymentDetails } = req.body;

        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json(CHECKOUT_NOT_FOUND);

        if (paymentStatus !== "paid") {
            return res.status(400).json({ msg: "Invalid payment status" });
        }

        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();
        await checkout.save();

        res.status(200).json(checkout);
    })
);

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post(
    "/:id/finalize",
    protect,
    asyncHandler(async (req, res) => {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json(CHECKOUT_NOT_FOUND);

        if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout already finalized" });
        }
        if (!checkout.isPaid) {
            return res.status(400).json({ message: "Checkout is not paid" });
        }

        // Create the final order from the checkout details
        const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: checkout.paymentDetails,
        });

        // Mark the checkout as finalized and clear the user's cart
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await Promise.all([checkout.save(), Cart.deleteOne({ user: checkout.user })]);

        res.status(200).json(finalOrder);
    })
);

module.exports = router;
