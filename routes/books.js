const router = require("express").Router();
const Book = require("../models/Book.model");
const User = require("../models/User.model");
const Request = require("../models/Request.model");

// DISPLAY WISH LIST
router.get("/books/wish-list", (req, res) => {
  res.render("books/wish-list");
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
    Book.findById(createdBook._id)
      .populate("owner")
      .exec((err, populatedBook) => {
        console.log("Populated Book: " + populatedBook);
      });
    // after you create a post, the property author was added to it, but the user is not aware of that, so we must edit the user and the post to the user's posts array
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

//EXPERIMENTAL STUFF - HOLY HELL THIS ONE WORKS

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
  console.log("Book ID = " + bookID);
  Book.findById(bookID).then((foundBook) => {
    res.render("books/book", { book: foundBook });
  });
});

module.exports = router;
