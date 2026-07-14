const validator = require("validator");
const bcrypt = require("bcrypt");
const UserModel = require("../models/Users");


// ✅ Register User
const registerUser = async (req, res) => {
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

    const data = {};
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_FIELDS.includes(key)) {
        data[key] = req.body[key];
      }
    });

    // 🔥 Validations
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
        message: "Invalid email",
      });
    }

    if (
      data.mobileNumber &&
      !validator.isMobilePhone(data.mobileNumber, "en-IN")
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid mobile number",
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
        message: "Weak password",
      });
    }

    data.email = data.email.toLowerCase().trim();
    data.firstName = data.firstName.trim();
    data.lastName = data.lastName.trim();

    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
      role: data.role || "customer",
      interests: data.interests || [],
    });

    res.status(201).json({
      status: true,
      message: "User registered",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email & password required",
      });
    }

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      status: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// ✅ Logout
const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: true,
    message: "Logout successful",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};