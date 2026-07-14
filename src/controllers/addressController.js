const Address = require("../models/Address");


// ✅ Create Address
const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    // If setting default → unset previous default
    if (data.isDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      ...data,
      user: userId,
    });

    res.status(201).json({
      status: true,
      message: "Address added",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ✅ Get User Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      status: true,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ✅ Update Address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    // Handle default switch
    if (updates.isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    Object.assign(address, updates);
    await address.save();

    res.status(200).json({
      status: true,
      message: "Address updated",
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// ✅ Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
};