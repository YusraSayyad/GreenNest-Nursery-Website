const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ================= ADD TO CART =================
router.post("/add", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });

        const newItem = {
            productId,
            quantity: quantity || 1
        };

        if (!cart) {
            cart = new Cart({
                userId,
                items: [newItem]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push(newItem);
            }
        }

        await cart.save();

        res.json({
            message: "Item added to cart",
            cart
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// ================= GET CART =================
// IMPORTANT: POPULATE PRODUCT
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate("items.productId");

        res.json(cart || { items: [] });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// ================= REMOVE ITEM =================
router.post("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        res.json({
            message: "Item removed",
            cart
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// ================= UPDATE QUANTITY =================
router.put("/update", async (req, res) => {
    try {
        const { userId, productId, action } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (action === "increase") {
            item.quantity += 1;
        }

        if (action === "decrease") {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart.items = cart.items.filter(
                    item => item.productId.toString() !== productId
                );
            }
        }

        await cart.save();

        res.json({
            message: "Cart updated",
            cart
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;