const express = require("express");
const { userAuth, adminAuth } = require("../middleware/auth");

const {
  getProfile,
  getAllUsers,
  updateProfile,
  deleteUser,
} = require("../controllers/profileController");

const router = express.Router();

// 🔒 Logged-in user
router.get("/", userAuth, getProfile);
router.patch("/", userAuth, updateProfile);

// 🔒 Admin only (recommended)
router.get("/users", adminAuth, getAllUsers);
router.delete("/:userId", adminAuth, deleteUser);

module.exports = router;
