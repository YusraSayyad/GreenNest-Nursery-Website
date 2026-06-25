const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

// ================= PLACE ORDER FROM CART =================
router.post("/", async (req, res) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart empty"
            });
        }

        const user = await User.findById(userId);

        let totalAmount = 0;

        const orderItems = cart.items.map(item => {
            totalAmount += item.productId.price * item.quantity;

            return {
                productId: item.productId._id,
                productName: item.productId.name,
                category: item.productId.category, // IMPORTANT
                price: item.productId.price,
                quantity: item.quantity,
                sellerId: item.productId.sellerId
            };
        });

        const order = new Order({
            userId,
            customerName: user.name,
            address: user.address,
            items: orderItems,
            totalAmount,
            status: "Pending"
        });

        await order.save();

        cart.items = [];
        await cart.save();

        res.json({
            message: "Order placed successfully",
            order
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= BUY NOW =================
router.post("/buynow", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const totalAmount = product.price * quantity;

        const order = new Order({
            userId,
            customerName: user.name,
            address: user.address,
            items: [
                {
                    productId: product._id,
                    productName: product.name,
                    category: product.category, // IMPORTANT
                    price: product.price,
                    quantity,
                    sellerId: product.sellerId
                }
            ],
            totalAmount,
            status: "Pending"
        });

        await order.save();

        res.json({
            message: "Buy now order placed",
            order
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= TOTAL ORDERS =================
router.get("/count", async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({ count: totalOrders });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= GET ALL ORDERS =================
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId")
            .populate("items.productId");

        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= SELLER ORDERS =================
router.get("/seller/:sellerId", async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        const orders = await Order.find({
            "items.sellerId": sellerId
        });

        res.json(orders);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= UPDATE ORDER STATUS =================
router.put("/:orderId/status", async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );

        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});


// ================= SELLER ANALYTICS =================
router.get("/analytics/:sellerId", async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        const orders = await Order.find({
            "items.sellerId": sellerId
        });

        let dailySales = {
            Mon: 0,
            Tue: 0,
            Wed: 0,
            Thu: 0,
            Fri: 0,
            Sat: 0,
            Sun: 0
        };

        let monthlyRevenue = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0
        };

        let categorySales = {
            Plants: 0,
            Seeds: 0,
            Pots: 0,
            Fertilizers: 0
        };

        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const day = days[orderDate.getDay()];
            dailySales[day]++;

            const month = months[orderDate.getMonth()];

            order.items.forEach(item => {
                if (item.sellerId.toString() === sellerId) {
                    monthlyRevenue[month] += item.price * item.quantity;

                    if (categorySales[item.category] !== undefined) {
                        categorySales[item.category] += item.quantity;
                    }
                }
            });
        });

        res.json({
            dailySales,
            monthlyRevenue,
            categorySales
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;