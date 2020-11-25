const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");

router.post("/request/:bookID", (req, res) => {
  const { bookID } = req.params;
  const { user } = req.session;
  if (!user) {
    return res.redirect("/auth/signup");
  }

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

router.post("/accept/:requestID", (req, res) => {
  const { requestID } = req.params;
  Request.findByIdAndUpdate(
    { _id: requestID },
    { status: "Accepted" },
    { new: true }
  ).then((acceptedRequest) => {
    console.log(
      `This is the request you are trying to accept; ${acceptedRequest}`
    );
    Request.find({ book: acceptedRequest.book, status: "Pending" }).then(
      (allRequests) => {
        console.log(allRequests);
        const updatingArray = allRequests.map((singleReq) => {
          return Request.findByIdAndUpdate(
            singleReq._id,
            { status: "Declined" },
            { new: true }
          );
        });
        Promise.all(updatingArray).then(() => {
          res.render("books/book");
        });
      }
    );
  });
});
module.exports = router;
