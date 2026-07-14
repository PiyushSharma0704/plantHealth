const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const cartRouter = express.Router();

// user
cartRouter.post("/add", auth, addToCart);
cartRouter.get("/", auth, getCart);
cartRouter.patch("/update/:itemId", auth, updateCartItem);
cartRouter.delete("/remove/:itemId", auth, removeCartItem);

module.exports = cartRouter;    