const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer memory storage
const upload = multer({
    storage: multer.memoryStorage()
});


// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================= GET SELLER PRODUCTS =================
router.get("/seller/:sellerId", async (req, res) => {
    try {
        const products = await Product.find({
            sellerId: req.params.sellerId
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ================= ADD PRODUCT =================
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const {
            name,
            price,
            category,
            description,
            rating,
            discount,
            sale,
            sellerId,
            sellerName
        } = req.body;

        let imageName = "";

        if (req.file) {
            // Create unique hash from image content
            const hash = crypto
                .createHash("md5")
                .update(req.file.buffer)
                .digest("hex");

            const ext = path.extname(req.file.originalname);
            imageName = hash + ext;

            const filePath = path.join(__dirname, "../uploads", imageName);

            // Save only if image doesn't already exist
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, req.file.buffer);
                console.log("New image saved");
            } else {
                console.log("Duplicate image detected, reused existing image");
            }
        }

        const product = new Product({
            name,
            price,
            category,
            description: description || "",
            rating: rating || 0,
            discount: discount || 0,
            sale: sale === "true",
            image: imageName,
            sellerId: sellerId || null,
            sellerName: sellerName || "Admin"
        });

        await product.save();

        res.json({
            success: true,
            message: "Product added successfully"
        });

    } catch (err) {
        console.log("ADD PRODUCT ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ================= DELETE PRODUCT =================
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Count how many products use same image
        const sameImageCount = await Product.countDocuments({
            image: product.image
        });

        // Delete image only if this is last product using it
        if (sameImageCount <= 1 && product.image) {
            const imagePath = path.join(
                __dirname,
                "../uploads",
                product.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("Unused image deleted");
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


// ================= EDIT PRODUCT =================
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let updatedData = {
            name: req.body.name || product.name,
            price: req.body.price || product.price,
            category: req.body.category || product.category,
            description: req.body.description || product.description,
            rating: req.body.rating || product.rating,
            discount: req.body.discount || product.discount,
            sale: req.body.sale
                ? req.body.sale === "true"
                : product.sale
        };

        if (req.file) {
            const hash = crypto
                .createHash("md5")
                .update(req.file.buffer)
                .digest("hex");

            const ext = path.extname(req.file.originalname);
            const newImageName = hash + ext;
            const newPath = path.join(__dirname, "../uploads", newImageName);

            if (!fs.existsSync(newPath)) {
                fs.writeFileSync(newPath, req.file.buffer);
            }

            // Delete old image if unused
            const sameImageCount = await Product.countDocuments({
                image: product.image
            });

            if (sameImageCount <= 1 && product.image) {
                const oldPath = path.join(
                    __dirname,
                    "../uploads",
                    product.image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            updatedData.image = newImageName;
        }

        await Product.findByIdAndUpdate(req.params.id, updatedData);

        res.json({
            message: "Product updated"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;