const express = require("express");
const Subscriber = require("../models/Subscriber");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post(
    "/subscribe",
    asyncHandler(async (req, res) => {
        const { email } = req.body;

        if (typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "Email is required" });
        }

        try {
            // The unique index on email rejects duplicates in a single round trip
            await Subscriber.create({ email });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Email is already subscribed" });
            }
            throw error;
        }

        res.status(201).json({ message: "Successfully subscribed to the newsletter" });
    })
);

module.exports = router;
