const express = require("express");
const vincenzo = express.Router();
const Book = require("../models/Book.model");
const Request = require("../models/Request.model");
const User = require("../models/User.model");
// const nodemailer = require("nodemailer");

vincenzo.post("/request/:bookID", (req, res) => {
  const { bookID } = req.params;
  const { when, requestingUser, book, status } = req.body;
  Request.create({
    when,
    requestingUser,
    book,
    status,
  }).then((createdRequest) => {
    Book.findByIdAndUpdate(
      req.params,
      {
        $addToSet: { requests: createdRequest },
      },
      { new: true }
    );
    console.log("this is the request:", Request);
    Book.findByIdAndUpdate(bookID)
      .populate("requests")
      .then((requestedBook) => {
        console.log("book trying to add request too:", requestedBook);
        res.redirect("/");
      });
  });
});

// Book.findById(bookID)
//   .populate("owner")
//   .then((foundBook) => {
//     console.log("Found book: ", foundBook);
//     res.render("books/book", { book: foundBook });
//   });

module.exports = vincenzo;

// let transporter = nodemailer.createTransport({
//   service: "smtp.ethereal.email",

//   auth: {
//     user: testAccount.user, // generated ethereal user
//     pass: testAccount.pass, // generated ethereal password
//   },
// });

// const transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "5bb65cf57bc2f2",
//     pass: "e05e0b92d19321",
//   },
// });
// transporter.sendMail({
//   from: '"Hugo" c74ba531ff-fac632@inbox.mailtrap.io', // sender address
//   to: "c74ba531ff-fac632@inbox.mailtrap.io", // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// });

// // vincenzo.post("/request/:bookID", (req, res) => {
//   const { bookID } = req.params;
//   const { user } = req.session.user._id;
//   Request.create({ requestingUser: user, book: bookID });
// })
