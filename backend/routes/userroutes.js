const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
    try {
        const { name, email, address, phone, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            address,
            phone,
            password: hashedPassword,
            role: role || "user"
        });

        await newUser.save();

        res.json({
            message: "Registration successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= TOTAL USERS =================
router.get("/count", async (req, res) => {
    try {
        const users = await User.find();

        console.log("===== CONNECTED USERS =====");
        users.forEach((u, i) => {
            console.log(`${i + 1}. ${u.email} | ${u.role}`);
        });

        res.json({ count: users.length });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;