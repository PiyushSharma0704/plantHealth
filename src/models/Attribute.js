const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  isFilterable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Attribute", attributeSchema);