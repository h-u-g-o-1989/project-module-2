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

  Request.create({ requestingUser: user._id, book: bookID }).then(
    (newRequest) => {
      console.log(`New request:  ${newRequest}`);
      Book.findByIdAndUpdate(bookID, {
        $addToSet: { requests: newRequest._id },
      }).then(() => {
        res.redirect(`/book/${bookID}`);
      });
    }
  );
});
//THIS IS IMPORTANT
// Request.find({
//   requestingUser: user._id,
//   book: bookID,
// })
//   .populate("book")
//   .populate("requestingUser")
//   .then((alreadyMade) => {
//     console.log(`This is not the first time you try to request this book`);
//     res.redirect(`/book/${bookID}`);
//   })
//   .catch((notMade) => {
//     console(`This is the first time you try to request this book`);
//     Request.create({ requestingUser: user._id, book: bookID }).then(
//       (newRequest) => {
//         console.log(`New request:  ${newRequest}`);
//         Book.findByIdAndUpdate(bookID, {
//           $addToSet: { requests: newRequest._id },
//         }).then(() => {
//           res.redirect(`/book/${bookID}`);
//         });
//       }
//     );

//console.log("user: ", JSON.stringify(user));
//});

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
    res.render("books/wish-list");
  });
});

module.exports = router;
