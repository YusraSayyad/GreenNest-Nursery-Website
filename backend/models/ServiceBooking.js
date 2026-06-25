const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema({
    serviceRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceRequest",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    timeSlot: {
        type: String,
        required: true
    },

    location: String,
    address: String,
    city: String,
    notes: String,

    paymentMethod: {
        type: String,
        default: "UPI"
    },

    coordinates: {
        lat: Number,
        lng: Number
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

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);