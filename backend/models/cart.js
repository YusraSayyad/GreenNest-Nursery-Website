const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            productName: String,
            price: Number,
            quantity: {
                type: Number,
                default: 1
            },

            image: String
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);