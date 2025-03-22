const express = require("express");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try{
        //Registration logic
        res.send({name, email, password });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;