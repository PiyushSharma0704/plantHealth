const Attribute = require("../models/Attribute");
const AttributeValue = require("../models/AttributeValue");

const createAttribute = async (req, res) => {
  try {
    const { name, values } = req.body;
    console.log("name", name)
    console.log("values", values)

    if (!name || !values || !values.length) {
      return res.status(400).json({
        status: false,
        message: "Name and values are required",
      });
    }

    // 1. Create Attribute
    const attribute = await Attribute.create({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    });

    // 2. Create Attribute Values
    const attributeValues = await AttributeValue.insertMany(
      values.map((val) => ({
        attribute: attribute._id,
        value: val,
        slug: val.toLowerCase().replace(/\s+/g, "-"),
      }))
    );

    res.status(201).json({
      status: true,
      message: "Attribute created successfully",
      data: {
        attribute,
        values: attributeValues,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find().populate("values");
    res.status(200).json({
      status: true,
      data: attributes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};  

const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, values } = req.body;

    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return res.status(404).json({
        status: false,
        message: "Attribute not found",
      });
    }

    // Update name if provided
    if (name) {
      attribute.name = name;
      attribute.slug = name.toLowerCase().replace(/\s+/g, "-");
    }

    await attribute.save();

    // Update values if provided
    if (values && values.length) {
      // Remove old values
      await AttributeValue.deleteMany({ attribute: id });

      // Add new values
      const attributeValues = await AttributeValue.insertMany(
        values.map((val) => ({
          attribute: id,
          value: val,
          slug: val.toLowerCase().replace(/\s+/g, "-"),
        }))
      );

      return res.status(200).json({
        status: true,
        message: "Attribute updated successfully",
        data: {
          attribute,
          values: attributeValues,
        },
      });
    }

    res.status(200).json({
      status: true,
      message: "Attribute updated successfully",
      data: {
        attribute,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
}

const deleteAttribute = async (req, res) => {   
  try {
    const { id } = req.params;

    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return res.status(404).json({
        status: false,
        message: "Attribute not found",
      });
    }

    // Remove attribute values
    await AttributeValue.deleteMany({ attribute: id });

    // Remove attribute
    await attribute.remove();

    res.status(200).json({
      status: true,
      message: "Attribute deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};  

module.exports = {
  createAttribute,
  getAttributes,
  deleteAttribute,
  updateAttribute,
};