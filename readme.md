# 🌿 GreenNest Nursery & Gardening Platform

GreenNest is a full-stack web platform for buying plants, pots, gardening tools, and booking gardening services online.
The platform includes **User**, **Admin**, and **Seller** functionalities.

## 🚀 Features

### 👤 User Features

* Register / Login
* Browse products (Plants, Pots, Tools, Fertilizers)
* Add products to cart
* Buy products directly using **Buy Now**
* Checkout & place orders
* Book gardening services
* Select service location using Google Maps
* Choose payment method (UPI / Card / Cash on Delivery)

### 🛠 Admin Features

* Admin login
* Add products
* Edit products
* Delete products
* Manage uploaded product images
* View all products in dashboard

### 🏪 Seller Features

* Seller login
* Add own products
* Manage own product listings

### 🌱 Gardening Services

* Garden setup
* Landscaping
* Plant maintenance
* Vertical garden installation
* Indoor plant styling
* Plant rental services

---

# 🧰 Tech Stack

## Frontend

* HTML
* CSS
* JavaScript

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas / MongoDB

## Other Tools

* Mongoose
* Multer (image upload)
* Google Maps API
* Git & GitHub

---

# 📂 Project Structure

```bash
GreenNest/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── cart.html
│   ├── checkout.html
│   ├── services.html
│   ├── book-service.html
│   └── ...
│
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Cart.js
│   │   ├── ServiceRequest.js
│   │   └── ServiceBooking.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── serviceRequestRoutes.js
│   │   └── serviceBookingRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   └── .env
│
└── README.md
```

---

# ⚙ Installation

## 1. Clone Repository

```bash
git clone <your-repository-url>
```

## 2. Move Into Project Folder

```bash
cd GreenNest
```

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

## 4. Create `.env`

Create a `.env` file inside backend:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/greennest
PORT=5000
```

## 5. Start Backend

```bash
node server.js
```

or

```bash
nodemon server.js
```

---

# 🔗 API Routes

## Product Routes

### Get Products

```http
GET /products
```

### Add Product

```http
POST /products/add
```

### Update Product

```http
PUT /products/:id
```

### Delete Product

```http
DELETE /products/:id
```

---

## Cart Routes

### Add to Cart

```http
POST /cart/add
```

### Get Cart

```http
GET /cart/:userId
```

---

## Service Routes

### Create Service Request

```http
POST /service-request/create
```

### Get Service

```http
GET /service-request/:id
```

### Book Service

```http
POST /service-booking
```

---

# 🖼 Image Upload Handling

Product images are uploaded using **Multer** and stored in:

```bash
backend/uploads/
```

Served using:

```javascript
app.use("/uploads", express.static("uploads"));
```

Image URL example:

```html
http://localhost:5000/uploads/plant.jpg
```

---

# 🔐 Security Notes

Sensitive files are excluded using `.gitignore`:

* `node_modules/`
* `.env`
* `uploads/`
* logs
* OS files

Never push:

* MongoDB credentials
* API keys
* Personal information
* Secret tokens

---

# 🌟 Future Improvements

* Online payment gateway integration
* Wishlist
* Product search & filters
* Order tracking
* Reviews & ratings system
* Email notifications
* AI plant recommendations

---

# 👩‍💻 Developer

Developed by **Yusra Sayyad**

A full-stack web development project built for learning and real-world practice.

---

# 📄 License

This project is for educational and portfolio purposes.
