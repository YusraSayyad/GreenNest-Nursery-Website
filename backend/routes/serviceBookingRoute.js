const express = require("express");
const router = express.Router();
const ServiceBooking = require("../models/ServiceBooking");

router.post("/", async (req, res) => {
    try {
        console.log("BOOKING DATA:", req.body);

        const {
            serviceRequestId,
            name,
            phone,
            date,
            timeSlot,
            location,
            address,
            city,
            notes,
            paymentMethod,
            coordinates
        } = req.body;

        // ✅ VALIDATION (IMPORTANT)
        if (!serviceRequestId || !name || !phone || !date || !timeSlot) {
            return res.status(400).json({
                message: "Missing required booking fields"
            });
        }

        const booking = new ServiceBooking({
            serviceRequestId,
            name,
            phone,
            date,
            timeSlot,
            location,
            address,
            city,
            notes,
            paymentMethod,
            coordinates
        });

        await booking.save();

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (err) {
        console.log("BOOKING ERROR:", err);

        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

module.exports = router;