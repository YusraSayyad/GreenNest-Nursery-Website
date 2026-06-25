const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    customerName: String,
    address: String,
items: [
  {
      productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
      },
      productName: String,
      category: String,   // ADD THIS
      price: Number,
      quantity: Number,
      sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      }
  }
],

    totalAmount: Number,

    status: {
        type: String,
        enum: ["Pending", "Packed", "Shipped", "Delivered"],
        default: "Pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);