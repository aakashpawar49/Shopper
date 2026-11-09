const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// Response body for login and register: public user fields plus a signed JWT
const authResponse = (user) => {
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" });

    return {
        user: {
            _id: user.id, // frontend reads user._id
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

// @route POST /api/users/register
router.post(
    "/register",
    asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        const exists = await User.exists({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password });
        res.status(201).json(authResponse(user));
    })
);

// @route POST /api/users/login
router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Only plain strings can match, so objects like { $ne: null } are rejected
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        res.json(authResponse(user));
    })
);

// @route GET /api/users/profile
router.get("/profile", protect, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;
