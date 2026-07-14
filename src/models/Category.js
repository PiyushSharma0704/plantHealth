const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    level: {
      type: Number,
      default: 0,
      min: [0, "Level cannot be negative"],
    },

    image: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

categorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

// ✅ Compound index: fast lookup of active categories under a parent
categorySchema.index({ parent: 1, isActive: 1 });

// ✅ Slug lookup stays as a single index (used in getProductBySlug-style routes)
categorySchema.index({ slug: 1 });

module.exports = mongoose.model("Category", categorySchema);
