const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    images: [
      {
        url: String,
        alt: String,
      },
    ],

    // 🌿 CATEGORY (Hierarchy ready)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // 🔥 KEEP THESE (MVP filters - fast queries)
    sunlight: {
      type: String,
      enum: ["low", "medium", "bright"],
    },

    watering: {
      type: String,
      enum: ["low", "moderate", "high"],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    indoor: {
      type: Boolean,
      default: true,
    },

    petSafe: {
      type: Boolean,
      default: false,
    },

    height: String,
    potSize: String,

    // 🚀 NEW: Flexible Attribute System (Future-proof)
    attributes: [
      {
        attribute: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
        },
        value: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AttributeValue",
        },
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// ⚡ INDEXES (IMPORTANT for scaling)
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ sunlight: 1 });
productSchema.index({ difficulty: 1 });

// 🔥 Attribute filtering index
productSchema.index({ "attributes.attribute": 1, "attributes.value": 1 });

const ProductsModel = mongoose.model("Products", productSchema);

module.exports = ProductsModel;