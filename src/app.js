const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

app.use(express.json()); 
app.use(cookieParser());
console.log("ENV:", process.env.MONGO_URI);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const productsRouter = require("./routes/products");
const categoryRouter = require("./routes/category");
const attributeRouter = require("./routes/attribute");
const productRouter = require("./routes/products");
const addressRouter = require("./routes/address");
const initializeJobs = require("./jobs");



app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/attributes", attributeRouter);
app.use("/api/v1/addresses", addressRouter);

initializeJobs();

// call DB connection
connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});
