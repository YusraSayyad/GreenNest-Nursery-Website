const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ServiceRequest = require("../models/ServiceRequest");

// CREATE
router.post("/create", async (req, res) => {
    try {
        const { userId, service } = req.body;

        if (!userId || !service?.name) {
            return res.status(400).json({ message: "Missing required service data" });
        }

        const newRequest = new ServiceRequest({
            userId,
            service
        });

        await newRequest.save();

        res.status(201).json({
            message: "Service request created",
            serviceRequest: newRequest
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// GET BY ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service request id" });
        }

        const request = await ServiceRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json({
            success: true,
            serviceRequest: request
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;