const slugify = require("slugify");
const ProductsModel = require("../models/Products");

const createProduct = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 Validations
    if (!data.name || data.name.trim().length < 2) {
      return res.status(400).json({
        status: false,
        message: "Product name must be at least 2 characters",
      });
    }

    if (!data.price || Number(data.price) < 0) {
      return res.status(400).json({
        status: false,
        message: "Valid price is required",
      });
    }

    if (
      data.discountPrice &&
      Number(data.discountPrice) >= Number(data.price)
    ) {
      return res.status(400).json({
        status: false,
        message: "Discount price must be less than price",
      });
    }

    // ✅ Generate slug
    const slug = slugify(data.name.trim(), {
      lower: true,
      strict: true,
    });

    // 🔥 Check duplicate
    const exists = await ProductsModel.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Product already exists",
      });
    }

    const product = await ProductsModel.create({
      ...data,
      name: data.name.trim(),
      slug,
    });

    res.status(201).json({
      status: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sunlight, watering, difficulty } =
      req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (sunlight) filter.sunlight = sunlight;
    if (watering) filter.watering = watering;
    if (difficulty) filter.difficulty = difficulty;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await ProductsModel.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await ProductsModel.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!product || !product.isActive) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.name) {
      updates.name = updates.name.trim();
      updates.slug = slugify(updates.name, {
        lower: true,
        strict: true,
      });
    }

    const product = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };