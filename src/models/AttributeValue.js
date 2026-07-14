const mongoose = require("mongoose");

const attributeValueSchema = new mongoose.Schema({
  attribute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    required: true,
  },

  value: {
    type: String, // e.g. "Low", "Bright"
    required: true,
  },

  slug: {
    type: String,
  },
});

module.exports = mongoose.model("AttributeValue", attributeValueSchema);
