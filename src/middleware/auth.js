const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // ✅ Allow both admin and superadmin
    if (!["admin", "superadmin"].includes(user.role)) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: admin access required",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // ✅ Check role from DB, not from token
    // ✅ Allow any valid role (customer, admin, superadmin) — just requires a valid session
    if (!user.isActive) {
      return res.status(403).json({
        status: false,
        message: "Account is deactivated",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { adminAuth, userAuth };