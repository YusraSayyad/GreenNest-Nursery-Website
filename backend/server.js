const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/products", require("./routes/productRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

const analyticsRoute = require("./routes/analyticsRoute");
app.use("/analytics", analyticsRoute);

const serviceRequestRoute = require("./routes/serviceRequestRoute");
app.use("/service-request", serviceRequestRoute);
const serviceBookingRoute = require("./routes/serviceBookingRoute");

app.use("/service-booking", serviceBookingRoute);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.listen(5000, ()=> {
    console.log("Server running on port 5000");
});