const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");
const User = require("../models/User.model");

router.post("/request/:bookID", (req, res) => {
  const { bookID } = req.params;
  const { user } = req.session.user._id;
  Request.create({ requestingUser: user, book: bookID });
});

module.exports = router;
