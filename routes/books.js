const router = require("express").Router();
const Book = require("../models/Book.model");
const User = require("../models/User.model");
const Request = require("../models/Request.model");

// DISPLAY WISH LIST
router.get("/books/wish-list", (req, res) => {
  const { user } = req.session;
  Request.find({ requestingUser: user._id, status: "Pending" })
    .populate("book")
    .then((wishlistEntries) => {
      console.log(wishlistEntries[0]);
      return res.render("books/wish-list", { entries: wishlistEntries });
    });
});

// DISPLAY BOOKS TO GIVE AWAY
router.get("/books/giveaway", (req, res) => {
  const { user } = req.session;
  const populatedUser = User.findById(user._id)
    .populate("booksToGive")
    .then((populatedUser) => {
      //console.log("User: ", populatedUser);
      res.render("books/giveaway", { user: populatedUser });
    });
});

// CREATING NEW BOOK (FORM)
router.get("/new-book", (req, res) => {
  // If not logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("books/new-book");
});

// const findBooksbyOwner = (userId) => {
// return Book.find(userId);
// };

router.post("/new-book", (req, res) => {
  // If not logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  // If logged in
  const { title, author, condition, genre, dateAdded, requests } = req.body;

  Book.create({
    title,
    author,
    condition,
    genre,
    dateAdded,
    requests,
    owner: req.session.user._id,
  }).then((createdBook) => {
    //console.log("The book you just added to your giveaway list is:", createdBook)
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { booksToGive: createdBook._id },
      },
      { new: true }
    ).then((newAndUpdatedUser) => {
      //console.log("Books to give:", newAndUpdatedUser.booksToGive);
      res.redirect("/books/giveaway");
    });
  });
});

router.get("/book/edit/:bookID", (req, res) => {
  const { bookID } = req.params;
  //console.log("req.params in the get: ", bookID);
  Book.findById(bookID).then((bookToEdit) => {
    //console.log(bookToEdit);
    res.render("books/edit", { bookToEdit });
  });
});

router.post("/book/edit/:bookID", (req, res) => {
  const { bookID } = req.params;
  const { author, title, genre, condition } = req.body;
  //console.log("bookID: ", bookID);
  Book.findByIdAndUpdate(bookID, { author, title, genre, condition }).then(
    (editedBook) => {
      res.redirect("/books/giveaway");
    }
  );
});

router.get("/book/delete/:bookID", (req, res) => {
  const { bookID } = req.params;
  console.log("bookID: ", bookID);
  Book.findByIdAndDelete(bookID, () => {
    console.log("Book removed");
  }).then((removedBook) => {
    console.log("Removed book: ", removedBook);
    res.redirect("/books/giveaway");
  });
});

router.get("/book/:bookID", (req, res) => {
  const { bookID } = req.params;
  //console.log(`Book ID:  ${bookID}`);

  Request.find({ book: bookID })
    .populate("requestingUser")
    .populate("book")
    .then((foundRequests) => {
      Book.findById({ _id: bookID })
        .populate("requests")
        .populate("owner")
        .then((foundBook) => {
          //console.log(`foundRequests'third element: ${foundRequests[2]}`);
          console.log(`Found book: ${foundBook}`);
          console.log(
            foundBook.requests.find((element) => element.status === "Accepted")
          );
          // console.log(`User ID: ${req.session.user._id}`);
          const isItAccepted = foundBook.requests.find(
            (element) => element.status === "Accepted"
          );
          let isLoggedIn = false;
          let isItOwnBook = false;
          let alreadyMadeRequest = false;
          if (req.session.user) {
            isLoggedIn = true;
            if (
              req.session.user._id.toString() === foundBook.owner._id.toString()
            ) {
              isItOwnBook = true;
            }
          }

          // console.log(
          //   `isLoggedIn: ${isLoggedIn}, isItOwnBook: ${isItOwnBook}, alreadyMadeRequest: ${alreadyMadeRequest}`
          // );
          // console.log(`Found request: ${foundRequests}`);
          // console.log(`Found book: ${foundBook}`);
          res.render("books/book", {
            book: foundBook,
            requests: foundRequests,
            isLoggedIn,
            isItOwnBook,
            alreadyMadeRequest,
            isItAccepted,
          });
        });
    });
});

module.exports = router;
