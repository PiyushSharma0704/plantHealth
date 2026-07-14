const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    imageUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
    },
    mobileNumber: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values (phone is optional)
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "en-IN");
        },
        message: "Please enter a valid Indian mobile number",
      },
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 6,
            minUppercase: 0,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 0,
          });
        },
        message:
          "Password must be at least 6 characters and include at least 1 number",
      },
    },
    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
      validate: {
        validator: function (value) {
          if (!["customer", "admin", "superadmin"].includes(value)) {
            throw new Error("Invalid role value");
          } else {
            return true;
          }
        },
      },
    },
    // addresses: {
    //   type: [addressSchema],
    //   validate: [
    //     (arr) => arr.length <= 5,
    //     "You can save a maximum of 5 addresses",
    //   ],
    // },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    interests: {
      type: [String],
      enum: ["gardening", "indoor plants", "outdoor plants", "succulents"],
      validate: {
        validator: function (arr) {
          return (
            Array.isArray(arr) &&
            arr.length >= 1 &&
            arr.length <= 5 &&
            arr.every((item) =>
              validator.isIn(item, [
                "gardening",
                "indoor plants",
                "outdoor plants",
                "succulents",
              ]),
            )
          );
        },
        message: "Select 1–5 valid interests only",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const payload = {
    _id: user._id,
    role: user.role, // 🔥 useful for auth
  };

  return await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const password = user.password;
  return await bcrypt.compare(inputPassword, password);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
