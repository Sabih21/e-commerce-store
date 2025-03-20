require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { connectDB } = require("./config/db");
const cors = require("cors");
const reviewRoutes = require('./routes/reviewRoute'); // Include the review routes
const flaggedRoutes = require('./routes/flaggedRoute'); // Include the review routes
const approvedRoutes = require('./routes/approvedRoute'); // Include the review routes
const fetch_reviews = require('./routes/fetch_reviews'); // Include the review routes

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/flagged', flaggedRoutes);
app.use('/api/approved', approvedRoutes);
app.use('/api/fetch_reviews' , fetch_reviews);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
