const express = require("express");
const { adminAuth } = require("../middleware/auth");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/add", adminAuth, createProduct);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", adminAuth, updateProduct);
productRouter.delete("/:id", adminAuth, deleteProduct);

module.exports = productRouter;