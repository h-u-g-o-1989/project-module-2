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
  res.render("books/giveaway", { user });
});

// CREATING NEW BOOK (FORM)
router.get("/new-book", (req, res) => {
  // If not logged in
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("books/new-book");
});

const findBooksbyOwner = (userId) => {
  return Book.find(userId);
};

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
    // after you create a post, the property author was added to it, but the user is not aware of that, so we must edit the user and the post to the user's posts array
    console.log("createdBook:", createdBook);
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { booksToGive: createdBook._id },
      },
      { new: true }
    ).then((newAndUpdatedUser) => {
      const books = findBooksbyOwner(newAndUpdatedUser);
      //console.log(`ITS HERE HUGOOO` + books);
      console.log("newAndUpdatedUser:", newAndUpdatedUser);
      res.redirect("/books/giveaway");
    });
  });
});

module.exports = router;
