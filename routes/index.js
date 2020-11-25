const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");

/* GET home page */
router.get("/", (req, res, next) => {
  const { user } = req.session;
  res.render("index", { user });
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
