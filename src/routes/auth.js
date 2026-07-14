const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth, adminAuth } = require("../middleware/auth");
const UserModel = require("../models/Users");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "email",
      "mobileNumber",
      "password",
      "role",
      "interests",
    ];

    // ✅ Filter only allowed fields
    const data = {};
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_FIELDS.includes(key)) {
        data[key] = req.body[key];
      }
    });

    // 🔥 VALIDATIONS

    if (!data.firstName || data.firstName.trim().length < 2) {
      return res.status(400).json({
        status: false,
        message: "First name must be at least 2 characters",
      });
    }

    if (!data.lastName || data.lastName.trim().length < 1) {
      return res.status(400).json({
        status: false,
        message: "Last name is required",
      });
    }

    if (!validator.isEmail(data.email || "")) {
      return res.status(400).json({
        status: false,
        message: "Invalid email address",
      });
    }

    if (
      data.mobileNumber &&
      !validator.isMobilePhone(data.mobileNumber, "en-IN")
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid Indian mobile number",
      });
    }

    if (
      !validator.isStrongPassword(data.password || "", {
        minLength: 6,
        minUppercase: 0,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Password must be at least 6 characters and contain at least 1 number",
      });
    }

    if (data.role && !["customer", "admin", "superadmin"].includes(data.role)) {
      return res.status(400).json({
        status: false,
        message: "Invalid role",
      });
    }

    if (data.interests) {
      const allowedInterests = [
        "gardening",
        "indoor plants",
        "outdoor plants",
        "succulents",
      ];

      if (
        !Array.isArray(data.interests) ||
        data.interests.length < 1 ||
        data.interests.length > 5 ||
        !data.interests.every((i) => allowedInterests.includes(i))
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid interests selection",
        });
      }
    }

    // ✅ Normalize data
    data.email = data.email.toLowerCase().trim();
    data.firstName = data.firstName.trim();
    data.lastName = data.lastName.trim();

    // 🔥 CHECK EXISTING USER
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists with this email",
      });
    }

    // 🔐 HASH PASSWORD
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 🔥 Create user
    const user = new UserModel({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: hashedPassword,
      role: data.role || "customer",
      interests: data.interests || [],
    });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      status: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      status: false,
      error: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password"); // ✅ include password
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const token = await user.getJWT();
    console.log("token11 ", token);
    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      status: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      status: false,
      error: error.message,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // expires immediately
  });

  res.status(200).json({
    message: "Logout successful",
    status: true,
  });
});

module.exports = authRouter;
