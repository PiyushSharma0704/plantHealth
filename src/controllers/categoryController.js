const slugify = require("slugify");
const Category = require("../models/Category");

// ✅ CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, parent, image } = req.body;
    console.log("name", name)

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        status: false,
        message: "Category name must be at least 2 characters",
      });
    }

    let level = 0;

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          status: false,
          message: "Invalid parent category",
        });
      }
      level = parentCategory.level + 1;
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Category already exists",
      });
    }

    // ✅ Use new + save() so pre("save") hook fires correctly
    const category = new Category({
      name: name.trim(),
      parent: parent || null,
      level,
      image: image || null,
    });
    await category.save();

    res.status(201).json({
      status: true,
      message: "Category created",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL (Tree structure)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();

    // 🔥 Build tree
    const map = {};
    const tree = [];

    categories.forEach((cat) => {
      map[cat._id.toString()] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent) {
        const parentNode = map[cat.parent.toString()];
        if (parentNode) {
          parentNode.children.push(map[cat._id.toString()]);
        }
      } else {
        tree.push(map[cat._id.toString()]);
      }
    });

    res.status(200).json({
      status: true,
      data: tree,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ✅ UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["name", "parent", "image", "isActive"];

    // ✅ Filter only allowed fields
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_UPDATES.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields provided for update",
      });
    }

    // ✅ Re-generate slug manually if name is being updated
    // (pre("save") doesn't fire on findByIdAndUpdate)
    if (updates.name) {
      updates.name = updates.name.trim();
      if (updates.name.length < 2) {
        return res.status(400).json({
          status: false,
          message: "Category name must be at least 2 characters",
        });
      }
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    // ✅ Validate parent if being updated
    if (updates.parent) {
      const parentCategory = await Category.findById(updates.parent);
      if (!parentCategory) {
        return res.status(400).json({
          status: false,
          message: "Invalid parent category",
        });
      }
      updates.level = parentCategory.level + 1;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ✅ DELETE CATEGORY (soft delete)
const deleteCategory = async (req, res) => {
  try {
    // ✅ Check it exists before deleting
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    res.status(200).json({
      status: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
