const express = require("express");
const {
  createAttribute,
  getAttributes,
  updateAttribute,
  deleteAttribute,
} = require("../controllers/attributeController");
const { userAuth } = require("../middleware/auth");

const attributeRouter = express.Router();

// public
attributeRouter.post("/createAttribute", createAttribute);
attributeRouter.get("/getAttributes", getAttributes);
attributeRouter.put("/updateAttribute/:id", userAuth, updateAttribute);
attributeRouter.delete("/deleteAttribute/:id", userAuth, deleteAttribute);

module.exports = attributeRouter;   