const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");
/* GET home page */

router.get("/", (req, res, next) => {
  const { user } = req.session;
  Book.find()
    .sort({ dateAdded: -1 })
    .limit(5)
    .populate("owner")
    .then((allTheBooks) => {
      res.render("index", { user: user, books: allTheBooks });
    });
});

router.get("/browse", (req, res) => {
  Book.find()
    .sort({ dateAdded: -1 })
    .populate("owner")
    .then((allTheBooks) => {
      res.render("browse", { books: allTheBooks });
    });
});

module.exports = router;
