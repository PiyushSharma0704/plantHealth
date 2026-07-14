const express = require("express");
const app = express();
const UserModel = require("./models/user");

// Middleware for logging requests using app.use() and next() (This will work)
// app.use("/test", (req, res, next) => {
//   console.log("Middleware for /test route");
//   next();
// }, (req, res) => {
//   res.send("This is the /test route working 🚀");
// });

// Middleware for logging requests using app.use() and next() (This will work with an error)
//RES: Middleware for /test2 route"

// app.post("/register", async (req, res) => {

//   const dummyUser = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     mobileNumber: "9876543210",
//     password: "password",
//   };
//   // Creatung a new instance of the UserModel
//   const user = new UserModel(dummyUser);
//   // Saving the user to the database
//   await user.save();
//   res.status(201).json({ message: "User created successfully", status: true, user });

// });