const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! from server");
});

app.get("/test", (req, res) => {
  res.send("This is the /test route working 🚀");
});

app.get("/hello", (req, res) => {
  res.send("This is the /hello route working 🚀");
});

app.listen(3000, () => {
  console.log("Test is running on port 3000");
});