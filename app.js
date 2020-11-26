// ℹ️ To get access to environment
require("dotenv").config();

// ℹ️ Connect to the database
require("./db");

const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

const projectName = "shelf-assured";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `Shelf-Assured`;
// default value for title local

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/", userRoutes);

const bookRoutes = require("./routes/books");
app.use("/", bookRoutes);

const requestRoutes = require("./routes/requests");
app.use("/", requestRoutes);

const searchRoutes = require("./routes/search");
app.use("/", searchRoutes);

// ❗ To handle errors. Routes that dont exist or errors that you handle in specfic routes
require("./error-handling")(app);

module.exports = app;
