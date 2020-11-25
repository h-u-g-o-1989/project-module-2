const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");

router.post("/request/:bookID", (req, res) => {
  const { bookID } = req.params;
  const { user } = req.session;
  //console.log("user: ", JSON.stringify(user));
  Request.create({ requestingUser: user._id, book: bookID }).then(
    (newRequest) => {
      console.log("New request: " + newRequest);
      Book.findByIdAndUpdate(bookID, {
        $addToSet: { requests: newRequest._id },
      }).then(() => {
        res.redirect("/book/" + bookID);
      });
    }
  );
});

module.exports = router;
