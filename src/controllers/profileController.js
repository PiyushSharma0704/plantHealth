const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");

// ✅ Get logged-in user (BEST way)
const getProfile = async (req, res) => {
  try {
    const user = req.user; // from userAuth middleware

    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ❌ (Optional) Remove this in production
// Get all users (Admin only ideally)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(200).json({
      status: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ❌ Delete user (should be protected)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 NEVER trust params for user update
    const data = req.body;

    const ALLOWED_FIELDS = ["firstName", "lastName", "imageUrl", "password"];

    const updates = {};
    Object.keys(data).forEach((key) => {
      if (ALLOWED_FIELDS.includes(key)) {
        updates[key] = data[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields to update",
      });
    }

    // 🔐 Hash password if updating
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const user = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  deleteUser,
  updateProfile,
};