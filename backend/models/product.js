const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    image: String,

    rating: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    sale: {
        type: Boolean,
        default: false
    },

    // NEW: product owner (seller)
    sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

sellerName: {
    type: String,
    default: "Admin"
}
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);