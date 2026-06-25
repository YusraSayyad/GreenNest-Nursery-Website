const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    service: {
        name: { type: String, required: true },
        message: { type: String, default: "" },
        location: { type: String, default: "" },
        description: { type: String, default: "" },
        price: { type: Number, default: 0 },
        image: { type: String, default: "" },
        features: { type: [String], default: [] }
    },

    status: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);