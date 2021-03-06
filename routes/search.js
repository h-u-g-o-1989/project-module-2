const router = require("express").Router();
const Book = require("../models/Book.model");
const User = require("../models/User.model");
const Request = require("../models/Request.model");
//  REMEMBER TO DELETE UNNECESSARY ROUTERS

router.post("/search", (req, res) => {
  const { search } = req.body;
  Book.find({ $or: [{ title: search }, { author: search }] })
    .populate("owner")
    .then((populatedResults) => {
      res.render("results", { books: populatedResults });
    });
});

module.exports = router;
