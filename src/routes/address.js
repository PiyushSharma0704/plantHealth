const express = require("express");
const { userAuth } = require("../middleware/auth");

const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const router = express.Router();

// All routes require login
router.post("/", userAuth, createAddress);
router.get("/", userAuth, getAddresses);
router.put("/:id", userAuth, updateAddress);
router.delete("/:id", userAuth, deleteAddress);

module.exports = router;