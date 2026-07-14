const express = require("express");
const { adminAuth } = require("../middleware/auth");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

// public
categoryRouter.get("/allCategories", getCategories);

// admin
categoryRouter.post("/add", adminAuth, createCategory);
categoryRouter.patch("/:id", adminAuth, updateCategory);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

module.exports = categoryRouter;