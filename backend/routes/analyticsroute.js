const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Seller analytics
router.get("/:sellerId", async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const orders = await Order.find();

        let dailySales = {
            Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0
        };

        let monthlyRevenue = {
            Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0,
            Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0
        };

        let categorySales = {
            Plants:0,
            Seeds:0,
            Pots:0,
            Fertilizers:0
        };

        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.sellerId?.toString() === sellerId) {
                    const orderDate = new Date(order.createdAt);

                    const day = days[orderDate.getDay()];
                    if(day !== "Sun") dailySales[day]++;

                    const month = months[orderDate.getMonth()];
                    monthlyRevenue[month] += item.price * item.quantity;

                    if (categorySales[item.category] !== undefined) {
                        categorySales[item.category]++;
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
        res.status(500).json({ message:"Server error" });
    }
});

module.exports = router;