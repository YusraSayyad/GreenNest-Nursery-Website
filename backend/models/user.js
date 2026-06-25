const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    address: String,
    phone: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);