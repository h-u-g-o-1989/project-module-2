const express = require("express");
const router = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");

router.post("/request/:bookID", (req, res, next) => {
  const { bookID } = req.params;
  const { user } = req.session;
  if (!user) {
    return res.redirect("/auth/signup");
  }
  //THIS IS IMPORTANT

  // Request.find({
  // requestingUser: user._id,
  // book: bookID,
  // }).then((alreadyMade) => {
  // res.redirect(`/book/${bookID}`);
  // });

  //console.log("user: ", JSON.stringify(user));
});

router.post("/accept/:requestID", (req, res) => {
  const { requestID } = req.params;
  Request.findByIdAndUpdate(
    { _id: requestID },
    { status: "Accepted" },
    { new: true }
  ).then((acceptedRequest) => {
    console.log(
      `This is the request you are trying to accept ${acceptedRequest}`
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
          res.redirect(`/book/${acceptedRequest.book._id}`);
        });
      }
    );
  });
});

router.get("/requests/delete/:requestID", (req, res) => {
  const { requestID } = req.params;
  Request.findByIdAndDelete(requestID, () => {
    console.log("Book removed from the wishlist");
  }).then(() => {
    res.redirect("/books/wish-list");
  });
});

module.exports = router;
