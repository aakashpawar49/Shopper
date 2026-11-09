const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

const USER_NOT_FOUND = { message: "User not found" };

router.param("id", validateObjectId(USER_NOT_FOUND));

// @route GET /api/admin/users
// @desc GET all users (Admin only)
// @access Private/Admin
router.get(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const users = await User.find({}).select("-password").lean();
        res.json(users);
    })
);

// @route POST /api/admin/users
// @desc Add a new user (Admin only)
// @access Private/Admin
router.post(
    "/",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;

        const exists = await User.exists({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "customer",
        });
        res.status(201).json({ message: "User created successfully", user });
    })
);

// @route PUT /api/admin/users/:id
// @desc Update user info (admin only) - Name, email and role
// @access Private/Admin
router.put(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json(USER_NOT_FOUND);

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({ message: "user updated successfully", user: updatedUser });
    })
);

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete(
    "/:id",
    protect,
    admin,
    asyncHandler(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json(USER_NOT_FOUND);

        res.json({ message: "User deleted successfully" });
    })
);

module.exports = router;
