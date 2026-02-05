const express = require("express");
const app = express();

// app.use("/", (req, res) => {
//   res.send("Hello, World! from server");
// });

app.use("/test", (req, res) => {
  res.send("This is the /test route working 🚀");
});

app.use("/hello", (req, res) => {
  res.send("This is the /hello route working 🚀");
});

// This will only return for POST requests to /user
app.post("/user", (req, res) => {
  res.send("This is the post /user route working 🚀");
});

// This will only return for GET requests to /user
// app.get("/user", (req, res) => {
//   res.send("This is the get /user route working 🚀");
// });

// This will only return for GET requests to /user with query parameters
app.get("/user", (req, res) => {
  console.log(req.query);
  res.send("This is the get /user route working 🚀");
});

// This will only return for GET requests to /user/:userID
app.get("/user/:userID", (req, res) => {
  console.log(req.params);
  res.send("This is the get / user/:userID route working 🚀");
});

// Matches GET requests to:
// /usr and /user
// because "e" is optional (? applies to the character before it)
app.get(/\/use?r/, (req, res) => {
  res.send("Optional e route working 🚀");
});

// Matches GET requests to:
// /user, /useer, /useeer, etc.
// because "+" means one or more of the previous character ("e")
app.get(/\/use+r/, (req, res) => {
  res.send("Repeated e route working 🚀");
});

// This will only return for DELETE requests to /user
app.delete("/user", (req, res) => {
  res.send("This is the DELETE /user route working 🚀");
});

// This will only return for put requests to /user
app.put("/user", (req, res) => {
  res.send("This is the put /user route working 🚀");
});

// This will only return for patch requests to /user
app.patch("/user", (req, res) => {
  res.send("This is the patch /user route working 🚀");
});

app.listen(3000, () => {
  console.log("Test is running on port 3000");
});
